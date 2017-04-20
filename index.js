export default class Interactor {
  constructor (context = {}) {
    this.context = context
  }

  static call (context = {}) {
    const instance = new this(context)
    return instance.run()
  }

  async run () {
    // group of interactors running
    if (this.organize) {
      const interactors = []
      for (const Interactor of this.organize()) {
        const instance = new Interactor(this.context)
        const nextContext = await instance.run()
        this.context = nextContext

        if (this.context.failure) {
          for (const instance of interactors) {
            await instance.rollback()
          }
          return this.context
        } else {
          interactors.push(instance)
        }
      }

      return this.context
    }

    // single interactor running
    try {
      if (this.before) await this.before()
      await this.call()
      this.context = {...this.context, success: true, failure: false}
      if (this.after) await this.after()
    } catch (error) {
      this.context = {...this.context, success: false, failure: true, error}
      if (this.rollback) await this.rollback()
    }

    return this.context
  }

  call () {
    throw new Error('Interactor requires a `call` method to be implemented')
  }

  fail (msg = 'Failed') {
    const err = typeof msg === 'string' ? new Error(msg) : msg
    throw err
  }
}
