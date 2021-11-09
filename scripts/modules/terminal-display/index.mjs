import prompt from 'async-prompt'
import chalk from 'chalk'

export async function confirm (_question = 'Continue ? (y/n)') {
  const question = _question.reset
    ? _question
    : chalk.bold.rgb(255, 255, 255).bgBlack(_question)
  const userInput = await prompt(`${question} `)
  return userInput.match(/^y$/i)
}
