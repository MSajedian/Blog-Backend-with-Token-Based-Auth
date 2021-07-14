import express from "express"
import UserModel from "./schema.js"
import {basicAuthMiddleware} from '../../auth/basic.js'
import { adminOnly } from '../../auth/admin.js'

import createError from "http-errors"

const usersRouter = express.Router()


usersRouter.get("/", basicAuthMiddleware, adminOnly, async(req,res,next) => {
  try {
    const users = await UserModel.find()
    res.send(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body)
    const { _id } = await newUser.save()

    res.status(201).send({_id})
  } catch (error) {
    console.log(error)
    if (error.name === "ValidationError") {
      next(createError(400, error))
    } else {
      next(createError(500, "An error occurred while saving user"))
    }
  }
})

usersRouter.get("/me", basicAuthMiddleware, async (req, res, next) => {
  try {
    res.send(req.user)
  } catch (error) {
    next(error)
  }
})

usersRouter.delete("/me", basicAuthMiddleware, async (req, res, next) => {
  try {
    await req.user.deleteOne()
  } catch (error) {
    next(error)
  }
})


usersRouter.put("/me", basicAuthMiddleware, async (req, res, next) => {
  try {

    // modifiy the user with the fields coming from req.body

    req.user.name = "Whatever"

    await req.user.save()
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
