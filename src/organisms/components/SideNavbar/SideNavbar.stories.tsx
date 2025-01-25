import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {SideNavbar} from './SideNavbar';

const meta: Meta<typeof SideNavbar> = {
  component: SideNavbar,
};

export default meta;

type Story = StoryObj<typeof SideNavbar>;

export const Basic: Story = {args: {}};
