const expect = require('expect')
let {generateMessage} = require('./message')

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    let msg = generateMessage('Andrew', 'Hello there')

    expect(typeof msg.sendedAt).toBe('string')
    expect(msg).toMatchObject({
      from: 'Andrew',
      text: 'Hello there'
    })
  })
})