import { ReactElement } from 'react';

export interface RouteState {
  status?: number;
  view?: ReactElement<any>;
  redirect?: string;
  meta?: {
    title?: string;
    description?: string;
  };
}
