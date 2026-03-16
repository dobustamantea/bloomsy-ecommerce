import { redirect } from "next/navigation";

interface CategoryPageProps {
  params: {
    categoria: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  redirect(`/shop?categoria=${encodeURIComponent(params.categoria)}`);
}
