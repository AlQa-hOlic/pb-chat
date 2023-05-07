import type { Meta, StoryObj } from '@storybook/react'

import Input from './index'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: 'PB Chat/Input',
  component: Input,
  decorators: [],
  tags: ['autodocs'],
  argTypes: {},
  parameters: {},
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    type: 'text',
    errorText: '',
  },
}
