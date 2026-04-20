// ==========================================
// SETUP
// ==========================================
Chart.register(ChartDataLabels);

const TOTAL = 108;
const pct = (v) => ((v / TOTAL) * 100).toFixed(1);
const pctInt = (v) => Math.round((v / TOTAL) * 100);

// Color palette from brand guideline
const C = {
    warmGray:    '#7d7060',
    steelBlue:   '#8498a8',
    darkTeal:    '#4e6169',
    gold:        '#d4b44c',
    goldLight:   '#e2c96e',
    goldDark:    '#b89a3a',
    lightGray:   '#e3e1dd',
    charcoal:    '#2d2e33',
    tealLight:   '#6a8590',
    warmLight:   '#a09580',
    slate:       '#5d6e78',
};

const PALETTE = [C.gold, C.steelBlue, C.darkTeal, C.warmGray, C.goldDark, C.tealLight, C.warmLight, C.slate, C.goldLight];

// Likert colors — warm to cool
const LIKERT_COLORS = ['#8b5e4b', '#c49650', '#d4b44c', '#8498a8', '#4e6169'];
const LIKERT_LABELS = ['1 - Tidak Penting', '2', '3', '4', '5 - Sangat Penting'];

// Chart defaults (dark text for light cards)
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.color = '#555555';
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.pointStyle = 'rectRounded';
Chart.defaults.plugins.legend.labels.padding = 16;

// ==========================================
// RAW DATA (108 responden)
// ==========================================

const orgTypeData = {
    'EO / PCO': 24,
    'Lembaga Pendidikan / Akademisi': 15,
    'Kementerian / Lembaga / Badan': 15,
    'Venue / Hotel': 13,
    'Dinas Pariwisata / Pemda': 11,
    'Travel Agent / Tour Operator': 6,
    'Perusahaan Swasta / Sponsor': 5,
    'Asosiasi Industri / Profesi': 5,
    'Lainnya': 14,
};

const eventFreqData = {
    '1–3 event/tahun': 46,
    '4–6 event/tahun': 18,
    '>6 event/tahun': 33,
    'Belum pernah': 11,
};

const eventScaleData = {
    'Lokal / Regional': 65,
    'Domestik / Nasional': 65,
    'Internasional': 29,
};

const knowledgeData = {
    'Belum tahu sama sekali': 17,
    'Tahu sedikit, belum menerapkan': 37,
    'Sudah mencoba sederhana': 40,
    'Rutin dgn metodologi standar': 14,
};

// Likert distributions
const q1_econMeasure = { 1: 1, 2: 3, 3: 7, 4: 32, 5: 65 };
const q2_econDecision = { 1: 0, 2: 0, 3: 11, 4: 37, 5: 60 };
const q3_econStakeholder = { 1: 0, 2: 1, 3: 9, 4: 35, 5: 63 };
const q5_environmental = { 1: 1, 2: 3, 3: 9, 4: 31, 5: 64 };
const q6_social = { 1: 0, 2: 1, 3: 6, 4: 29, 5: 72 };

function calcAvg(dist) {
    let sum = 0, count = 0;
    for (let k in dist) { sum += parseInt(k) * dist[k]; count += dist[k]; }
    return (sum / count).toFixed(2);
}

// Average ekonomi = avg of Q1,Q2,Q3
const avgEkon = ((parseFloat(calcAvg(q1_econMeasure)) + parseFloat(calcAvg(q2_econDecision)) + parseFloat(calcAvg(q3_econStakeholder))) / 3).toFixed(2);

const challengesData = {
    'Kurangnya Pengetahuan / SDM': 66,
    'Tidak Ada Regulasi / Standar': 58,
    'Keterbatasan Anggaran': 55,
    'Kurangnya Dukungan Mitra': 38,
    'Kesulitan Mengukur Dampak': 37,
    'Lainnya': 2,
};

const challengeCountData = {
    '1 tantangan': 41,
    '2 tantangan': 23,
    '3 tantangan': 20,
    '4 tantangan': 11,
    '5 tantangan': 13,
};

const certStatusData = {
    'Sudah bersertifikasi': 8,
    'Berencana mengajukan': 24,
    'Sedang dalam proses': 4,
    'Belum ada rencana': 22,
    'Tidak tahu / Tidak relevan': 16,
    'Tidak disebutkan': 34,
};

// ==========================================
// TAB SWITCHING
// ==========================================
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// ==========================================
// TAB 1: RINGKASAN
// ==========================================

// Jenis Organisasi
new Chart(document.getElementById('chartOrgType'), {
    type: 'bar',
    data: {
        labels: Object.keys(orgTypeData),
        datasets: [{
            data: Object.values(orgTypeData).map(v => pctInt(v)),
            backgroundColor: PALETTE,
            borderRadius: 6,
            borderSkipped: false,
            barThickness: 26,
        }]
    },
    options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            datalabels: {
                anchor: 'end', align: 'end',
                color: '#555',
                font: { weight: 600, size: 12 },
                formatter: (v) => v + '%',
            }
        },
        scales: {
            x: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 }, callback: v => v + '%' }, max: 30 },
            y: { grid: { display: false }, ticks: { font: { size: 11 } } },
        }
    }
});

// Frekuensi Event
new Chart(document.getElementById('chartEventFreq'), {
    type: 'doughnut',
    data: {
        labels: Object.keys(eventFreqData),
        datasets: [{
            data: Object.values(eventFreqData),
            backgroundColor: [C.gold, C.steelBlue, C.darkTeal, C.warmGray, C.tealLight],
            borderColor: '#e9e9e9',
            borderWidth: 3,
            hoverOffset: 8,
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '55%',
        plugins: {
            legend: { position: 'bottom', labels: { font: { size: 12 }, padding: 14 } },
            datalabels: {
                color: '#fff',
                font: { weight: 700, size: 13 },
                formatter: (v) => pctInt(v) + '%',
            }
        }
    }
});

// Skala Event
new Chart(document.getElementById('chartEventScale'), {
    type: 'bar',
    data: {
        labels: Object.keys(eventScaleData),
        datasets: [{
            data: Object.values(eventScaleData).map(v => pctInt(v)),
            backgroundColor: [C.darkTeal, C.steelBlue, C.gold],
            borderRadius: 8,
            barThickness: 36,
        }]
    },
    options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            datalabels: {
                anchor: 'end', align: 'end',
                color: '#555',
                font: { weight: 700, size: 13 },
                formatter: (v) => v + '%',
            }
        },
        scales: {
            x: { grid: { color: 'rgba(0,0,0,0.05)' }, max: 85, ticks: { callback: v => v + '%' } },
            y: { grid: { display: false }, ticks: { font: { size: 13, weight: 500 } } },
        }
    }
});

// Tingkat Pengetahuan
new Chart(document.getElementById('chartKnowledge'), {
    type: 'bar',
    data: {
        labels: Object.keys(knowledgeData),
        datasets: [{
            data: Object.values(knowledgeData).map(v => pctInt(v)),
            backgroundColor: [C.warmGray, C.goldDark, C.gold, C.steelBlue, C.tealLight],
            borderRadius: 8,
            barThickness: 30,
        }]
    },
    options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            datalabels: {
                anchor: 'end', align: 'end',
                color: '#555',
                font: { weight: 700, size: 13 },
                formatter: (v) => v + '%',
            }
        },
        scales: {
            x: { grid: { color: 'rgba(0,0,0,0.05)' }, max: 45, ticks: { callback: v => v + '%' } },
            y: { grid: { display: false }, ticks: { font: { size: 11 } } },
        }
    }
});

// ==========================================
// TAB 2: DAMPAK EKONOMI & KEBERLANJUTAN
// ==========================================

// LEFT: Pentingnya Aspek Keberlanjutan (3 dimensi: Ekonomi, Lingkungan, Sosial)
const sustainLabels = [
    'Aspek\nEkonomi',
    'Aspek\nLingkungan',
    'Aspek\nSosial'
];
const sustainDists = [q1_econMeasure, q5_environmental, q6_social];

new Chart(document.getElementById('chartSustainRatings'), {
    type: 'bar',
    data: {
        labels: sustainLabels,
        datasets: [1,2,3,4,5].map((rating, i) => ({
            label: LIKERT_LABELS[i],
            data: sustainDists.map(d => pctInt(d[rating] || 0)),
            backgroundColor: LIKERT_COLORS[i],
            borderRadius: 4,
            borderSkipped: false,
        }))
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 12 } },
            datalabels: {
                color: '#fff',
                font: { weight: 600, size: 11 },
                formatter: (v) => v > 3 ? v + '%' : '',
            }
        },
        scales: {
            x: { stacked: true, grid: { display: false }, ticks: { font: { size: 11 } } },
            y: { stacked: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { callback: v => v + '%' } },
        }
    }
});

// RIGHT: Pentingnya Pengukuran Ekonomi Berdasarkan Tujuan (2 sub)
const econLabels = [
    'Data untuk\nPengambilan Keputusan',
    'Laporan untuk\nPemangku Kepentingan'
];
const econDists = [q2_econDecision, q3_econStakeholder];

new Chart(document.getElementById('chartEconRatings'), {
    type: 'bar',
    data: {
        labels: econLabels,
        datasets: [1,2,3,4,5].map((rating, i) => ({
            label: LIKERT_LABELS[i],
            data: econDists.map(d => pctInt(d[rating] || 0)),
            backgroundColor: LIKERT_COLORS[i],
            borderRadius: 4,
            borderSkipped: false,
        }))
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 12 } },
            datalabels: {
                color: '#fff',
                font: { weight: 600, size: 11 },
                formatter: (v) => v > 3 ? v + '%' : '',
            }
        },
        scales: {
            x: { stacked: true, grid: { display: false }, ticks: { font: { size: 11 } } },
            y: { stacked: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { callback: v => v + '%' } },
        }
    }
});

// Rata-rata Skor per Dimensi Keberlanjutan (Radar)
new Chart(document.getElementById('chartSustainAvg'), {
    type: 'radar',
    data: {
        labels: ['Ekonomi\n(dampak PDB,\npengeluaran, multiplier)', 'Lingkungan\n(limbah, karbon,\nefisiensi energi)', 'Sosial\n(komunitas, UMKM,\naksesibilitas)'],
        datasets: [{
            label: 'Skor Rata-rata',
            data: [avgEkon, calcAvg(q5_environmental), calcAvg(q6_social)],
            backgroundColor: 'rgba(212, 180, 76, 0.12)',
            borderColor: C.gold,
            borderWidth: 2.5,
            pointBackgroundColor: C.gold,
            pointRadius: 6,
            pointHoverRadius: 8,
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            datalabels: {
                color: C.darkTeal,
                font: { weight: 700, size: 14 },
                anchor: 'end', align: 'end',
            }
        },
        scales: {
            r: {
                min: 3,
                max: 5,
                ticks: { stepSize: 0.5, backdropColor: 'transparent', font: { size: 10 }, color: '#888' },
                grid: { color: 'rgba(78,97,105,0.12)' },
                angleLines: { color: 'rgba(78,97,105,0.12)' },
                pointLabels: { font: { size: 11, weight: 500 }, color: '#555' }
            }
        }
    }
});

// Skor per Dimensi Berdasarkan Organisasi (Grouped Bar)
const orgLabelsShort = ['EO/PCO', 'Akademisi', 'Dinas Pariwisata', 'Kementerian', 'Venue/Hotel', 'Swasta', 'Travel Agent', 'Asosiasi'];

new Chart(document.getElementById('chartByOrg'), {
    type: 'bar',
    data: {
        labels: orgLabelsShort,
        datasets: [
            {
                label: 'Ekonomi',
                data: [4.50, 4.56, 4.52, 4.27, 4.56, 4.07, 4.28, 4.80],
                backgroundColor: C.gold,
                borderRadius: 4,
            },
            {
                label: 'Lingkungan',
                data: [4.33, 4.60, 4.55, 4.13, 4.54, 3.60, 4.83, 5.00],
                backgroundColor: C.steelBlue,
                borderRadius: 4,
            },
            {
                label: 'Sosial',
                data: [4.62, 4.87, 4.73, 4.27, 4.54, 4.60, 4.67, 4.80],
                backgroundColor: C.darkTeal,
                borderRadius: 4,
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 14 } },
            datalabels: {
                display: false,
            }
        },
        scales: {
            x: { grid: { display: false }, ticks: { font: { size: 9 }, maxRotation: 45 } },
            y: { min: 3.5, max: 5, grid: { color: 'rgba(0,0,0,0.05)' } },
        }
    }
});

// ==========================================
// TAB 3: TANTANGAN
// ==========================================

// Tantangan utama
new Chart(document.getElementById('chartChallenges'), {
    type: 'bar',
    data: {
        labels: Object.keys(challengesData),
        datasets: [{
            data: Object.values(challengesData).map(v => pctInt(v)),
            backgroundColor: [C.gold, C.goldDark, C.steelBlue, C.darkTeal, C.warmGray, C.tealLight],
            borderRadius: 8,
            barThickness: 36,
        }]
    },
    options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            datalabels: {
                anchor: 'end', align: 'end',
                color: '#555',
                font: { weight: 700, size: 13 },
                formatter: (v) => v + '%',
            }
        },
        scales: {
            x: { grid: { color: 'rgba(0,0,0,0.05)' }, max: 85, ticks: { callback: v => v + '%' } },
            y: { grid: { display: false }, ticks: { font: { size: 12, weight: 500 } } },
        }
    }
});

// Jumlah tantangan per responden
new Chart(document.getElementById('chartChallengeCombo'), {
    type: 'bar',
    data: {
        labels: Object.keys(challengeCountData),
        datasets: [{
            data: Object.values(challengeCountData).map(v => pctInt(v)),
            backgroundColor: [C.darkTeal, C.steelBlue, C.gold, C.goldDark, C.warmGray, C.tealLight],
            borderRadius: 8,
            barThickness: 32,
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            datalabels: {
                anchor: 'end', align: 'end',
                color: '#555',
                font: { weight: 700, size: 13 },
                formatter: (v) => v + '%',
            }
        },
        scales: {
            x: { grid: { display: false }, ticks: { font: { size: 11 } } },
            y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { callback: v => v + '%' } },
        }
    }
});

// Tantangan per tingkat pengetahuan
const totalLow = 54; // Belum tahu + Tahu sedikit
const totalHigh = 54; // Sudah mencoba + Rutin

new Chart(document.getElementById('chartChallengeByKnowledge'), {
    type: 'bar',
    data: {
        labels: ['Anggaran', 'Kurangnya\nPengetahuan', 'Tidak Ada\nStandar', 'Kurangnya\nDukungan Mitra', 'Kesulitan\nMengukur'],
        datasets: [
            {
                label: 'Belum paham / Tahu sedikit',
                data: [Math.round(29/totalLow*100), Math.round(35/totalLow*100), Math.round(27/totalLow*100), Math.round(16/totalLow*100), Math.round(21/totalLow*100)],
                backgroundColor: C.warmGray,
                borderRadius: 6,
            },
            {
                label: 'Sudah mencoba / Rutin menerapkan',
                data: [Math.round(26/totalHigh*100), Math.round(31/totalHigh*100), Math.round(31/totalHigh*100), Math.round(22/totalHigh*100), Math.round(16/totalHigh*100)],
                backgroundColor: C.steelBlue,
                borderRadius: 6,
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 14 } },
            datalabels: {
                color: '#fff',
                font: { weight: 600, size: 11 },
                formatter: (v) => v > 10 ? v + '%' : '',
            }
        },
        scales: {
            x: { grid: { display: false }, ticks: { font: { size: 10 } } },
            y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { callback: v => v + '%' } },
        }
    }
});

// ==========================================
// TAB 4: SERTIFIKASI
// ==========================================

// Status sertifikasi
new Chart(document.getElementById('chartCertStatus'), {
    type: 'doughnut',
    data: {
        labels: Object.keys(certStatusData),
        datasets: [{
            data: Object.values(certStatusData),
            backgroundColor: [C.gold, C.steelBlue, C.darkTeal, C.warmGray, C.goldDark, C.tealLight],
            borderColor: '#e9e9e9',
            borderWidth: 3,
            hoverOffset: 8,
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '50%',
        plugins: {
            legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 12 } },
            datalabels: {
                color: '#fff',
                font: { weight: 700, size: 12 },
                formatter: (v) => {
                    let p = pctInt(v);
                    return p > 5 ? p + '%' : '';
                },
            }
        }
    }
});

// Sertifikasi per organisasi
const certByOrgLabels = ['EO / PCO', 'Akademisi', 'Dinas Pariwisata', 'Kementerian', 'Venue / Hotel'];
new Chart(document.getElementById('chartCertByOrg'), {
    type: 'bar',
    data: {
        labels: certByOrgLabels,
        datasets: [
            {
                label: 'Sudah Bersertifikasi',
                data: [4, 0, 0, 1, 2].map((v, i) => {
                    const totals = [24, 15, 11, 15, 13];
                    return Math.round(v / totals[i] * 100);
                }),
                backgroundColor: C.gold,
                borderRadius: 4,
            },
            {
                label: 'Berencana / Dalam Proses',
                data: [9, 0, 7, 4, 5].map((v, i) => {
                    const totals = [24, 15, 11, 15, 13];
                    return Math.round(v / totals[i] * 100);
                }),
                backgroundColor: C.steelBlue,
                borderRadius: 4,
            },
            {
                label: 'Belum Berencana / Tidak Tahu',
                data: [11, 0, 4, 10, 6].map((v, i) => {
                    const totals = [24, 15, 11, 15, 13];
                    return Math.round(v / totals[i] * 100);
                }),
                backgroundColor: C.warmGray,
                borderRadius: 4,
            },
            {
                label: 'Tidak Disebutkan',
                data: [0, 15, 0, 0, 0].map((v, i) => {
                    const totals = [24, 15, 11, 15, 13];
                    return Math.round(v / totals[i] * 100);
                }),
                backgroundColor: 'rgba(120, 120, 120, 0.3)',
                borderRadius: 4,
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 12 } },
            datalabels: {
                color: '#fff',
                font: { weight: 600, size: 11 },
                formatter: (v) => v > 0 ? v + '%' : '',
            }
        },
        scales: {
            x: { stacked: true, grid: { display: false }, ticks: { font: { size: 11 } } },
            y: { stacked: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { callback: v => v + '%' } },
        }
    }
});

// Sertifikasi vs Keberlanjutan
const certVsEsg = {
    'Sudah Sertifikasi': 4.50,
    'Berencana Mengajukan': 4.71,
    'Dalam Proses': 4.88,
    'Belum Berencana': 4.32,
    'Tidak Tahu / N/A': 4.12,
};

new Chart(document.getElementById('chartCertVsEsg'), {
    type: 'bar',
    data: {
        labels: Object.keys(certVsEsg),
        datasets: [{
            label: 'Rata-rata Skor Keberlanjutan',
            data: Object.values(certVsEsg),
            backgroundColor: [C.gold, C.steelBlue, C.darkTeal, C.warmGray, C.goldDark],
            borderRadius: 10,
            barThickness: 44,
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            datalabels: {
                anchor: 'end', align: 'end',
                color: '#555',
                font: { weight: 800, size: 15 },
            }
        },
        scales: {
            x: { grid: { display: false }, ticks: { font: { size: 12 } } },
            y: { min: 3.5, max: 5, grid: { color: 'rgba(0,0,0,0.05)' } },
        }
    }
});

