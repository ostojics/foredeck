import {createFileRoute} from '@tanstack/react-router';
import HomePage from '@/modules/home/components/home-page';

export const Route = createFileRoute('/__pathlessLayout/home')({
  component: () => <HomePage />,
});
