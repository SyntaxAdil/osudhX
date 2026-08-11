// src/components/pages/dashboard/seller-dashboard.tsx
export function SellerDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl border border-border/60 bg-card shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
          <h3 className="text-2xl font-bold text-foreground mt-2">৳ 45,230</h3>
        </div>
        <div className="p-6 rounded-2xl border border-border/60 bg-card shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Total Products</p>
          <h3 className="text-2xl font-bold text-foreground mt-2">128</h3>
        </div>
        <div className="p-6 rounded-2xl border border-border/60 bg-card shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Active Orders</p>
          <h3 className="text-2xl font-bold text-foreground mt-2">24</h3>
        </div>
        <div className="p-6 rounded-2xl border border-border/60 bg-card shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
          <h3 className="text-2xl font-bold text-destructive mt-2">3</h3>
        </div>
      </div>
    </div>
  );
}