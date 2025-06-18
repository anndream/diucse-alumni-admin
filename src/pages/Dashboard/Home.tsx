const AdminHome = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Banner with overlay */}
      <div className="relative w-full">
        <img
          src="/carusole/carusole1.png"
          alt="Admin Banner"
          className="w-full md:h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-opacity-30 flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">👋 Welcome, Admin</h1>
          <p className="max-w-xl text-sm md:text-lg">
            Manage your alumni platform efficiently from this dashboard.
          </p>
        </div>
      </div>

      {/* Admin Statistics Section */}
      <div className="mt-10 px-4 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold text-blue-600">👥 Total Users</h2>
          <p className="text-3xl font-bold text-gray-800 mt-2">1,234</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold text-green-600">🎓 Alumni Listed</h2>
          <p className="text-3xl font-bold text-gray-800 mt-2">567</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold text-yellow-600">📅 Events Upcoming</h2>
          <p className="text-3xl font-bold text-gray-800 mt-2">3</p>
        </div>
      </div>

      {/* Optional Future Area */}
      <div className="mt-12 px-4 md:px-16 pb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">🧾 Admin Notes</h2>
        <p className="text-gray-600">
          You can monitor alumni activity, update events, verify users, and manage the overall
          alumni portal from this panel. Use the sidebar menu for full control options.
        </p>
      </div>
    </div>
  );
};

export default AdminHome;
