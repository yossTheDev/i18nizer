import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('extract', () => {
  it('runs extract cmd', async () => {
    const {stdout} = await runCommand('extract')
    expect(stdout).to.contain('hello world')
  })

  it('runs extract --name oclif', async () => {
    const {stdout} = await runCommand('extract --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
