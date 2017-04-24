import test from 'ava'
import Interactor from './'

test('basic interactor', async t => {
  const context = {
    user: 'mike'
  }

  class Test extends Interactor {
    async call () {
      const {user} = this.context
      t.is(user, 'mike')
      this.context.user = 'james'
    }
  }

  const result = await Test.call(context)
  t.true(result.success)
  t.false(result.failure)
  t.is(result.user, 'james')
})

test('rollback interactor', async t => {
  t.plan(5)

  const context = {
    next: 1
  }

  class Test extends Interactor {
    async call () {
      t.pass()
      this.context.next++
      throw new Error()
    }

    async rollback () {
      t.pass()
      this.context.next = 1
    }
  }

  const result = await Test.call(context)
  t.false(result.success)
  t.true(result.failure)
  t.is(result.next, 1)
})

test('organize', async t => {
  t.plan(5)

  const context = {
    next: 1
  }

  class Test1 extends Interactor {
    async call () {
      t.pass()
      this.context.next++
    }
  }

  class Test2 extends Interactor {
    async call () {
      t.pass()
      this.context.next++
    }
  }

  class Test3 extends Interactor {
    organize () {
      return [Test1, Test2]
    }
  }

  const result = await Test3.call(context)
  t.true(result.success)
  t.false(result.failure)
  t.is(result.next, 3)
})

test('before/after', async t => {
  t.plan(4)
  const context = {}

  class Test extends Interactor {
    async before () {
      if (!this.context.user) {
        this.context.user = {new: true}
      }
    }

    async call () {
      this.context.user.new = false
    }

    async after () {
      if (this.context.user.new) {
        throw new Error('User should be `false`')
      }

      this.context.user.id = 1
    }
  }

  const result = await Test.call(context)
  t.true(result.success)
  t.false(result.failure)
  t.is(result.user.id, 1)
  t.false(result.user.new)
})
