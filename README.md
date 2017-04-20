# async-interactor
Interactor pattern using async/await

## Usage

```js
import Interactor from 'async-interactor'

class AuthenticateUser extends Interactor {
  async call () {
    const {username, password} = this.context

    const user = await db.where({username, password}).find()

    if (!user) {
      this.fail('User not found')
    }

    this.context.user = user
  }
}

// example route handler
app.post('/login', async (req, res) => {
  const result = await AuthenticateUser.call(req.params)
  if (result.success) {
    res.send({success: true, user: result.user})
  }
})
```

## Organizers

```js
import Interactor from 'async-interactor'

class AddSubscription extends Interactor {
  // return Array of interactors
  organize () {
    return [AuthenticateUser, FinalizePayment]
  }
}

app.post('/buy', async (req, res) => {
  const result = await AddSubscription.call(req.params)
})
```
