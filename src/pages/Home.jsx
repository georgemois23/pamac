import HomePage from '../views/HomePage';
import { FriendProvider } from '../context/FriendContext';
export default function Home() {
  return (
    <FriendProvider>
      <HomePage />
    </FriendProvider>
  );
}