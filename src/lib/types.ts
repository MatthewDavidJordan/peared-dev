import type { Dispatch, SetStateAction } from 'react';

export type Setter<T> = Dispatch<SetStateAction<T>>;

declare module 'swagger-ui-react';
declare module 'next-swagger-doc';
