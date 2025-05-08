import { User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';
import { useEffect, useState } from 'react';
import axios from '@/services/axios';

export default function UserProfile() {
  const userId = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  const [user, setUser] = useState({ name: '', email: '' });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/get/${userId}`);
        const data = res.data;

        setUser({
          name: data.user.name || '',
          email: data.user.email || '',
        });
      } catch (error) {
        console.error('[PERFIL] Erro ao carregar perfil:', error);
      }
    }

    fetchProfile();
  }, []);

  return (
    <Link
      to="/dashboard/profile"
      className="bg-[#1f2937] rounded-xl p-4 flex items-center gap-3 hover:bg-[#2d3748] transition"
    >
      <div className="bg-white/10 p-2 rounded-full">
        <User className="text-white" size={24} />
      </div>
      <div>
        <h4 className="font-semibold text-sm">{user.name}</h4>
        <p className="text-xs text-white/60">{user.email}</p>
      </div>
    </Link>
  );
}
