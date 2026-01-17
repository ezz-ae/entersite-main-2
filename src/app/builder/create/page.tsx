import { redirect } from 'next/navigation';

export default function BuilderCreatePage() {
  redirect('/builder?start=1');
}
