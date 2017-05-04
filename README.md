<h1 align="center">async interactor</h1>

<div align="center">
  <a href="https://github.com/collectiveidea/interactor">Interactor</a> pattern for node.js/browser using async/await
</div>
<br>
<div align="center">
  <a href="https://badge.fury.io/js/async-interactor"><img src="https://badge.fury.io/js/async-interactor.svg"></a>
</div>

## Getting Started

```sh
$ npm install --save async-interactor
```

_NOTE: async/await support from node 7.6.0 or higher is required!_

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

## Errors

By default any errors thrown inside of an interactor are swallowed and return in the result of the interactor. This allows you to check the result of the interactor after it runs, regardless of a success or failure. There is a `throwOnError` option available if you don't want this default behavior.

```js
class ThisWillThrow extends Interactor {
  throwOnError = true

  async call () {
    throw new Error('Boom')
  }
}

const result = await ThisWillThrow.call({})
console.log(result) // <- this never runs because the error is `thrown`
```
