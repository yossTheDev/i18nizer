import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('keys', () => {
  it('runs keys cmd', async () => {
    const {stdout} = await runCommand('keys')
    expect(stdout).to.contain('hello world')
  })

  it('runs keys --name oclif', async () => {
    const {stdout} = await runCommand('keys --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
