import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storage';
import { Save, Plus, Trash2, Calendar as CalIcon, BookOpen, Clock, Download } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { SLOT_TIMES } from '../utils/calculations';

export default function SettingsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [settings, setSettings] = useState({
        courseName: '',
        semesterStart: '',
        lastWorkingDate: '',
        subjects: []
    });

    const [holidays, setHolidays] = useState([]);
    const [newSubject, setNewSubject] = useState('');
    const [newHoliday, setNewHoliday] = useState(''); // Date string

    const [fullData, setFullData] = useState(null);

    useEffect(() => {
        if (user) {
            const data = storageService.getData(user.id);
            if (data) {
                setFullData(data);
                setSettings(data.settings);
                setHolidays(data.holidays || []);
            }
            setLoading(false);
        }
    }, [user]);

    const handleSave = () => {
        const newData = {
            ...fullData,
            settings,
            holidays
        };
        storageService.saveData(user.id, newData);
        setFullData(newData);
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const addSubject = () => {
        if (newSubject && !settings.subjects.includes(newSubject)) {
            setSettings(s => ({ ...s, subjects: [...s.subjects, newSubject] }));
            setNewSubject('');
        }
    };

    const removeSubject = (sub) => {
        setSettings(s => ({ ...s, subjects: s.subjects.filter(x => x !== sub) }));
    };

    const addHoliday = () => {
        // Basic validation
        if (newHoliday && !holidays.some(h => h === newHoliday)) {
            setHolidays(h => [...h, newHoliday].sort());
            setNewHoliday('');
        }
    };

    const removeHoliday = (date) => {
        setHolidays(h => h.filter(x => x !== date));
    };

    const handleExport = () => {
        if (!fullData?.attendance) return;

        const headers = ['Date', 'Day', '8:00-10:00', '10:00-12:00', '1:00-3:00', '3:00-5:00'];
        let csvContent = headers.join(',') + '\n';

        const sortedDates = Object.keys(fullData.attendance).sort();

        sortedDates.forEach(date => {
            const dayRecord = fullData.attendance[date];
            const row = [
                date,
                format(parseISO(date), 'EEEE')
            ];

            for (let i = 0; i < 4; i++) {
                const slot = dayRecord[i];
                if (slot && slot.subject) {
                    row.push(`"${slot.subject} (${slot.status || '-'})"`);
                } else {
                    row.push('-');
                }
            }
            csvContent += row.join(',') + '\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `attendance_guard_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <header>
                <h2 className="text-3xl font-bold text-white mb-2">Configuration</h2>
                <p className="text-slate-400">Setup your semester details and holidays to get accurate attendance tracking.</p>
            </header>

            {/* Course Details */}
            <section className="glass-card p-6 space-y-6">
                <h3 className="text-xl font-semibold flex items-center gap-2 text-violet-400">
                    <BookOpen size={20} />
                    Course & Semester
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="label">Course Name</label>
                        <input
                            type="text"
                            className="input-base"
                            placeholder="e.g. B.Tech Computer Science"
                            value={settings.courseName}
                            onChange={e => setSettings({ ...settings, courseName: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="label">Semester Start Date</label>
                        <input
                            type="date"
                            className="input-base"
                            value={settings.semesterStart || ''}
                            onChange={e => setSettings({ ...settings, semesterStart: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="label">Last Working Date</label>
                        <input
                            type="date"
                            className="input-base"
                            value={settings.lastWorkingDate || ''}
                            onChange={e => setSettings({ ...settings, lastWorkingDate: e.target.value })}
                        />
                    </div>
                </div>
            </section>

            {/* Subjects */}
            <section className="glass-card p-6 space-y-6">
                <h3 className="text-xl font-semibold flex items-center gap-2 text-pink-400">
                    <BookOpen size={20} />
                    Subjects
                </h3>

                <div className="flex gap-4">
                    <input
                        type="text"
                        className="input-base"
                        placeholder="Enter subject name..."
                        value={newSubject}
                        onChange={e => setNewSubject(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addSubject()}
                    />
                    <button onClick={addSubject} className="btn btn-secondary shrink-0">
                        <Plus size={18} /> Add
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {settings.subjects.map((sub, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                            <span className="font-medium">{sub}</span>
                            <button onClick={() => removeSubject(sub)} className="text-slate-500 hover:text-red-400">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    {settings.subjects.length === 0 && (
                        <p className="text-slate-500 col-span-full italic">No subjects added yet.</p>
                    )}
                </div>
            </section>

            {/* Holidays */}
            <section className="glass-card p-6 space-y-6">
                <h3 className="text-xl font-semibold flex items-center gap-2 text-blue-400">
                    <Clock size={20} />
                    Default Timetable
                </h3>
                <p className="text-sm text-slate-400">Set your default weekly schedule to auto-fill subjects in the daily view.</p>

                <div className="space-y-4">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                        <div key={day} className="flex flex-col md:flex-row gap-4 items-start md:items-center p-4 bg-slate-900/30 rounded-xl border border-slate-700/50">
                            <div className="w-24 font-bold text-slate-300">{day}</div>
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
                                {SLOT_TIMES.map((time, slotIdx) => (
                                    <div key={slotIdx} className="flex flex-col gap-1">
                                        <label className="text-xs text-slate-500">{time}</label>
                                        <select
                                            className="input-base text-sm py-2"
                                            value={settings.timetable?.[day]?.[slotIdx] || ''}
                                            onChange={(e) => {
                                                const newTimetable = { ...(settings.timetable || {}) };
                                                if (!newTimetable[day]) newTimetable[day] = {};
                                                newTimetable[day][slotIdx] = e.target.value;
                                                setSettings({ ...settings, timetable: newTimetable });
                                            }}
                                        >
                                            <option value="">- Select -</option>
                                            <option value="Free">Free</option>
                                            {settings.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Holidays */}
            <section className="glass-card p-6 space-y-6">
                <h3 className="text-xl font-semibold flex items-center gap-2 text-orange-400">
                    <CalIcon size={20} />
                    University Holidays
                </h3>
                <p className="text-sm text-slate-400">Sundays are automatically excluded. Add specific dates here.</p>

                <div className="flex gap-4">
                    <input
                        type="date"
                        className="input-base"
                        value={newHoliday}
                        onChange={e => setNewHoliday(e.target.value)}
                    />
                    <button onClick={addHoliday} className="btn btn-secondary shrink-0">
                        <Plus size={18} /> Add Holiday
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {holidays.map((date, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                            <span className="font-medium">{date}</span>
                            <button onClick={() => removeHoliday(date)} className="text-slate-500 hover:text-red-400">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    {holidays.length === 0 && (
                        <p className="text-slate-500 col-span-full italic">No custom holidays added.</p>
                    )}
                </div>
            </section>

            {/* Data Management */}
            <section className="glass-card p-6 space-y-6">
                <h3 className="text-xl font-semibold flex items-center gap-2 text-emerald-400">
                    <Download size={20} />
                    Data Management
                </h3>
                <p className="text-sm text-slate-400">Export your attendance data to a CSV file for Excel or external use.</p>

                <button onClick={handleExport} className="btn bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 w-full sm:w-auto">
                    <Download size={18} /> Export Attendance Report (.csv)
                </button>
            </section>

            {/* Save Action */}
            <div className="sticky bottom-6 flex justify-end">
                <div className="glass p-2 rounded-xl flex items-center gap-4">
                    {message.text && (
                        <span className={`text-sm font-medium px-2 ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                            {message.text}
                        </span>
                    )}
                    <button onClick={handleSave} className="btn btn-primary shadow-xl">
                        <Save size={18} /> Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );
}
