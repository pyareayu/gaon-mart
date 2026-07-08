export default function Footer() {
  return (
    <footer className="bg-earth-900 text-earth-50 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid sm:grid-cols-3 gap-8 text-sm">
        <div>
          <div className="font-display font-800 text-lg mb-2">🥭 GaonMart</div>
          <p className="text-earth-50/60">
            Village-first quick commerce for Manika, Bishanpur, Chand, Musahari, Kanti, Sakra, Paroo,
            Minapur, Motipur, Bochaha and nearby villages of Muzaffarpur, Bihar.
          </p>
        </div>
        <div>
          <div className="font-semibold mb-2">Serving villages</div>
          <p className="text-earth-50/60">
            Manika · Bishanpur · Chand · Musahari · Kanti · Sakra · Paroo · Minapur · Motipur · Bochaha
          </p>
        </div>
        <div>
          <div className="font-semibold mb-2">GaonMart</div>
          <p className="text-earth-50/60">Delivery in 12–40 minutes · Cash on delivery available</p>
        </div>
      </div>
      <div className="text-center text-xs text-earth-50/40 pb-6">
        © {new Date().getFullYear()} GaonMart — Apni Village, Apna Mart
      </div>
    </footer>
  );
}
