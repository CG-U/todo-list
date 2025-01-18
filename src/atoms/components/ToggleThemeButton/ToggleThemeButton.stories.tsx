import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {ToggleThemeButton} from './ToggleThemeButton';

const meta: Meta<typeof ToggleThemeButton> = {
  component: ToggleThemeButton,
};

export default meta;

type Story = StoryObj<typeof ToggleThemeButton>;

export const Basic: Story = {args: {}};
