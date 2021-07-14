import express from "express"
import UserModel from "./schema.js"
import { JWTAuthMiddleware } from '../../auth/middlewares.js'
import { JWTAuthenticate } from "../../auth/tools.js"

import { adminOnly } from '../../auth/admin.js'

import createError from "http-errors"

const usersRouter = express.Router()


usersRouter.get("/", JWTAuthMiddleware, adminOnly, async (req, res, next) => {
  try {
    const users = await UserModel.find()
    res.send(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body)
    const { _id } = await newUser.save()

    res.status(201).send({ _id })
  } catch (error) {
    console.log(error)
    if (error.name === "ValidationError") {
      next(createError(400, error))
    } else {
      next(createError(500, "An error occurred while saving user"))
    }
  }
})

usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    res.send(req.user)
  } catch (error) {
    next(error)
  }
})

usersRouter.delete("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    await req.user.deleteOne()
  } catch (error) {
    next(error)
  }
})

usersRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.user._id, req.body, {
      runValidators: true,
      new: true,
    })
    if (user) {
      res.send(user)
    } else {
      next(createError(404, `User ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while modifying user"))
  }
})

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body
    // 1. Verify credentials
    const user = await UserModel.checkCredentials(email, password)
    if (user) {
      // 2. Generate token if credentials are ok
      const accessToken = await JWTAuthenticate(user)
      // 3. Send token as a response
      res.send({ accessToken })
    } else {
      next(createError(401))
    }
  } catch (error) {
    next(error)
  }
})

// usersRouter.get("/:id", async (req, res, next) => {
//   try {
//     const id = req.params.id
//     const user = await UserModel.findById(id)
//     if (user) {
//       res.send(user)
//     } else {
//       next(createError(404, `User ${req.params.id} not found`))
//     }
//   } catch (error) {
//     console.log(error)
//     next(createError(500, "An error occurred while getting user"))
//   }
// })



// usersRouter.put("/:id", async (req, res, next) => {
//   try {
//     const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
//       runValidators: true,
//       new: true,
//     })
//     if (user) {
//       res.send(user)
//     } else {
//       next(createError(404, `User ${req.params.id} not found`))
//     }
//   } catch (error) {
//     console.log(error)
//     next(createError(500, "An error occurred while modifying user"))
//   }
// })

// usersRouter.delete("/:id", async (req, res, next) => {
//   try {
//     const user = await UserModel.findByIdAndDelete(req.params.id)
//     if (user) {
//       res.status(204).send()
//     } else {
//       next(createError(404, `User ${req.params.id} not found`))
//     }
//   } catch (error) {
//     console.log(error)
//     next(createError(500, "An error occurred while deleting student"))
//   }
// })

export default usersRouter
