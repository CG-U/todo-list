import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {TasksPanel} from './TasksPanel';

const meta: Meta<typeof TasksPanel> = {
  component: TasksPanel,
};

export default meta;

type Story = StoryObj<typeof TasksPanel>;

export const Basic: Story = {args: {}};
