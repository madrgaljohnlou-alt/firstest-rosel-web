import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout.jsx';

const API_URL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

const initialForm = {
  code: '',
  type: 'percent',
  amount: 10,
  expirationDate: '',
  minOrderAmount: 0,
  userLimit: '',
  useLimit: '',
  perUserUseLimit: 1,
  manualStatus: 'Active',
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/coupons/admin`);
      setCoupons(data);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = normalizePayload(form);
      await axios.post(`${API_URL}/coupons/admin`, payload);
      toast.success('Coupon created');
      setForm(initialForm);
      await fetchCoupons();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Create failed');
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (coupon) => {
    const status = coupon.effectiveStatus || coupon.manualStatus;
    if (["Used", "Expired", "Removed"].includes(status)) {
      toast.error(`Coupon is ${status.toLowerCase()} and cannot be edited`);
      return;
    }
    setEditingId(coupon._id);
    setForm({
      code: coupon.code,
      type: coupon.type,
      amount: coupon.amount,
      expirationDate: coupon.expirationDate?.slice(0, 16) || '',
      minOrderAmount: coupon.minOrderAmount || 0,
      userLimit: coupon.userLimit ?? '',
      useLimit: coupon.useLimit ?? '',
      perUserUseLimit: coupon.perUserUseLimit ?? 1,
      manualStatus: coupon.manualStatus || 'Active',
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      const payload = normalizePayload(form);
      delete payload.code; // not editable
      await axios.put(`${API_URL}/coupons/admin/${editingId}`, payload);
      toast.success('Coupon updated');
      setEditingId(null);
      setForm(initialForm);
      await fetchCoupons();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Update failed');
    }
  };

  return (
    <AdminLayout>
      <div className='p-6'>
        <h1 className='text-2xl font-semibold mb-4 text-[#82695b]'>Coupons</h1>

      <form onSubmit={editingId ? handleUpdate : handleCreate} className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <Input label='Code' value={form.code} onChange={(v)=>setForm(f=>({...f, code:v}))} disabled={!!editingId} required />
        <Select label='Type' value={form.type} onChange={(v)=>setForm(f=>({...f, type:v}))} options={[{value:'percent',label:'Percent'},{value:'fixed',label:'Fixed ($)'}]} />
        <Input label={form.type==='percent'?'Amount (%)':'Amount ($)'} type='number' value={form.amount} onChange={(v)=>setForm(f=>({...f, amount:Number(v)}))} required />
        <Input label='Expiration' type='datetime-local' value={form.expirationDate} onChange={(v)=>setForm(f=>({...f, expirationDate:v}))} required />
        <Input label='Min Order ($)' type='number' value={form.minOrderAmount} onChange={(v)=>setForm(f=>({...f, minOrderAmount:Number(v)}))} />
        <Input label='User Limit (# users)' type='number' value={form.userLimit} onChange={(v)=>setForm(f=>({...f, userLimit: v === '' ? '' : Number(v)}))} />
        <Input label='Use Limit (total uses)' type='number' value={form.useLimit} onChange={(v)=>setForm(f=>({...f, useLimit: v === '' ? '' : Number(v)}))} />
        <Input label='Per-User Use Limit' type='number' value={form.perUserUseLimit} onChange={(v)=>setForm(f=>({...f, perUserUseLimit:Number(v)}))} />
        <Select label='Manual Status' value={form.manualStatus} onChange={(v)=>setForm(f=>({...f, manualStatus:v}))} options={["Active","Inactive","Used","Expired","Removed"].map(s=>({value:s,label:s}))} />
        <div className='md:col-span-3'>
          <button className='px-4 py-2 bg-[#901414] hover:bg-[#7a0f0f] text-[#feffff] rounded transition-colors disabled:opacity-50' disabled={creating}>
            {editingId ? 'Update Coupon' : 'Create Coupon'}
          </button>
          {editingId && (
            <button type='button' className='ml-2 px-4 py-2 bg-[#82695b] hover:bg-[#6b5649] text-[#feffff] rounded transition-colors' onClick={()=>{ setEditingId(null); setForm(initialForm); }}>Cancel</button>
          )}
        </div>
      </form>

      <div className='overflow-x-auto'>
        <table className='min-w-full border border-[#82695b]'>
          <thead>
            <tr className='bg-[#82695b]'>
              <Th>Code</Th>
              <Th>Status</Th>
              <Th>Amount</Th>
              <Th>User limit</Th>
              <Th>Use limit</Th>
              <Th>Used (total)</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className='p-3 text-[#82695b]' colSpan={7}>Loading...</td></tr>
            ) : coupons.length === 0 ? (
              <tr><td className='p-3 text-[#82695b]' colSpan={7}>No coupons</td></tr>
            ) : (
              coupons.map(c => (
                <tr key={c._id} className='border-t border-[#82695b] hover:bg-[#f8f3ed] transition-colors'>
                  <Td>{c.code}</Td>
                  <Td>{c.effectiveStatus || c.manualStatus}</Td>
                  <Td>{c.type === 'percent' ? `${c.amount}%` : `₱${c.amount}`}</Td>
                  <Td>{c.userLimit ?? '—'}</Td>
                  <Td>{c.useLimit ?? '—'}</Td>
                  <Td>{c.usage?.totalUses ?? 0}</Td>
                  <Td>
                    <button className='px-3 py-1 text-sm bg-[#901414] hover:bg-[#7a0f0f] text-[#feffff] rounded transition-colors' onClick={()=>startEdit(c)}>Edit</button>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>
    </AdminLayout>
  );
}

function Input({ label, type='text', value, onChange, required, disabled }) {
  const controlledValue = value === undefined || value === null ? '' : value;
  return (
    <label className='flex flex-col gap-1'>
      <span className='text-sm text-[#82695b] font-medium'>{label}</span>
      <input className='border border-[#82695b] rounded px-3 py-2 bg-[#f8f3ed] text-[#82695b] focus:ring-2 focus:ring-[#901414] focus:border-transparent' type={type} value={controlledValue}
        onChange={(e)=>onChange(e.target.value)} required={required} disabled={disabled} />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  const controlledValue = value === undefined || value === null ? '' : value;
  return (
    <label className='flex flex-col gap-1'>
      <span className='text-sm text-[#82695b] font-medium'>{label}</span>
      <select className='border border-[#82695b] rounded px-3 py-2 bg-[#f8f3ed] text-[#82695b] focus:ring-2 focus:ring-[#901414] focus:border-transparent' value={controlledValue} onChange={(e)=>onChange(e.target.value)}>
        {options.map(opt => typeof opt === 'string' ? (
          <option key={opt} value={opt}>{opt}</option>
        ) : (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  );
}

function Th({ children }) { return <th className='text-left p-3 border-b border-[#82695b] text-[#feffff] font-medium'>{children}</th>; }
function Td({ children }) { return <td className='p-3 text-[#82695b]'>{children}</td>; }

function normalizePayload(form) {
  const safeType = form.type || 'percent';
  const rawAmount = form.amount;
  const parsedAmount = rawAmount === '' || rawAmount === undefined || rawAmount === null ? 0 : Number(rawAmount);
  return {
    code: (form.code || '').trim(),
    type: safeType,
    amount: parsedAmount,
    expirationDate: form.expirationDate ? new Date(form.expirationDate).toISOString() : undefined,
    minOrderAmount: Number(form.minOrderAmount) || 0,
    userLimit: form.userLimit === '' || form.userLimit === undefined ? null : Number(form.userLimit),
    useLimit: form.useLimit === '' || form.useLimit === undefined ? null : Number(form.useLimit),
    perUserUseLimit: Number(form.perUserUseLimit) || 1,
    manualStatus: form.manualStatus || 'Active',
  };
}


