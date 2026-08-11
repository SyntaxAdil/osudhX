import { TooltipProvider } from "../../components/ui/tooltip";

export function DashboardLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return (
    <div>
      <TooltipProvider>{children}</TooltipProvider>
    </div>
  );
}
/*
sidebar - 
seller - [
overview
products
inventory
orders
]

customer [
overview
whislist
my orders
..
]
*/
