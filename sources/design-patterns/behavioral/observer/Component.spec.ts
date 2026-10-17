import InputText from './InputText'
import Label from './Label'

test('Deve escrever em um input text e atualizar a label', () => {
  const inputText = new InputText('country')
  const label = new Label('País: {{country}}')
  inputText.register(label)
  inputText.setValue('Brasil')
  expect(label.value).toBe('País: Brasil')
})
