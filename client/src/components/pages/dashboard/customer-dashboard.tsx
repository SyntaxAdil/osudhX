// src/components/pages/dashboard/customer-dashboard.tsx
export function CustomerDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl border border-border/60 bg-card shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">My Orders</p>
          <h3 className="text-2xl font-bold text-foreground mt-2">5</h3>
        </div>
        <div className="p-6 rounded-2xl border border-border/60 bg-card shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Wishlist Items</p>
          <h3 className="text-2xl font-bold text-foreground mt-2">12</h3>
        </div>
        <div className="p-6 rounded-2xl border border-border/60 bg-card shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Active Prescriptions</p>
          <h3 className="text-2xl font-bold text-foreground mt-2">2</h3>
        </div>
      </div>
    </div>
  );
}