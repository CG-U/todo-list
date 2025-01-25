import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {MobileNavBar} from './MobileNavBar';

const meta: Meta<typeof MobileNavBar> = {
  component: MobileNavBar,
};

export default meta;

type Story = StoryObj<typeof MobileNavBar>;

export const Basic: Story = {args: {}};
