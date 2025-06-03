import React from 'react';
import Header from './partials/header';
import Footer from './partials/footer';
import UsersList from '../components/UsersList';


function AdminPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-teal-400 mb-8">Administration</h1>
          <div className="grid gap-8">
            <UsersList />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminPage;
