import Chart from 'chart.js/auto';
import confetti from 'canvas-confetti';

// State & Mock Data
let currentLang = 'EN';
let isPaidAli = false;
let isPaidFatima = false;

// Sample Bills Database
const sampleBillsData = {
  electric: {
    vendor: '⚡ KElectric',
    no: '98421049-01',
    amount: '14,850',
    amountVal: 14850,
    date: '2026-10-18',
    title: 'KElectric Bill',
    category: '⚡ Utilities',
    splitText: '4 Members (PKR 3,712/ea)'
  },
  internet: {
    vendor: '🌐 StormFiber',
    no: 'SF-554109-PK',
    amount: '4,500',
    amountVal: 4500,
    date: '2026-10-15',
    title: 'StormFiber Bill',
    category: '🌐 Connectivity',
    splitText: '4 Members (PKR 1,125/ea)'
  },
  gas: {
    vendor: '🔥 SSGC Gas',
    no: 'SSGC-99210-04',
    amount: '3,200',
    amountVal: 3200,
    date: '2026-10-22',
    title: 'SSGC Gas Bill',
    category: '🔥 Utilities',
    splitText: '4 Members (PKR 800/ea)'
  }
};

let activeBillKey = 'electric';

// Initialize on DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initCashRain();
  initSegmentedTabs();
  initDemoTabs();
  initOcrScanner();
  initDebtSimplifier();
  initDashboardActions();
  initAnalyticsCharts();
  initLanguageToggle();
  initQuickScrollButtons();
});

// Navbar Elevation on Scroll
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.05)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });
}

// Segmented Control Tabs Switcher
function initSegmentedTabs() {
  const segBtns = document.querySelectorAll('.seg-btn');
  segBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      segBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

// Interactive Demo Tabs Switcher
function initDemoTabs() {
  const demoBtns = document.querySelectorAll('.demo-tab-btn');
  const demoPanels = document.querySelectorAll('.demo-panel');

  demoBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // If already active, do not re-run or glitch
      if (btn.classList.contains('active')) return;

      const targetDemo = btn.dataset.demo;
      
      demoBtns.forEach(b => b.classList.remove('active'));
      demoPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(`demo-${targetDemo}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }

      if (targetDemo === 'analytics') {
        initAnalyticsCharts();
      }
    });
  });
}

// AI OCR Receipt Scanner Logic
function initOcrScanner() {
  const sampleChips = document.querySelectorAll('.sample-bill-chip');
  const dropzone = document.getElementById('scanner-dropzone');
  const btnRunOcr = document.getElementById('btn-run-ocr');
  const ocrSpinner = document.getElementById('ocr-spinner');
  const ocrBtnText = document.getElementById('ocr-btn-text');
  const btnSaveBill = document.getElementById('btn-save-bill');

  // Switch sample bill
  sampleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      sampleChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeBillKey = chip.dataset.bill;
      updateReceiptPreview(activeBillKey);
    });
  });

  // Run OCR
  btnRunOcr.addEventListener('click', () => {
    dropzone.classList.add('scanning');
    ocrSpinner.style.display = 'inline-block';
    ocrBtnText.textContent = 'Scanning Bill...';
    btnRunOcr.disabled = true;

    setTimeout(() => {
      dropzone.classList.remove('scanning');
      ocrSpinner.style.display = 'none';
      ocrBtnText.textContent = '✨ Scan Bill';
      btnRunOcr.disabled = false;

      // Populate AI form
      const data = sampleBillsData[activeBillKey];
      document.getElementById('ai-input-title').value = data.title;
      document.getElementById('ai-input-amount').value = data.amount;
      document.getElementById('ai-input-date').value = data.date;
      document.getElementById('ai-input-category').value = data.category;
      document.getElementById('ai-input-split').value = data.splitText;

      // Flash highlight effect on inputs
      document.querySelectorAll('#ai-extracted-form input').forEach(input => {
        input.style.backgroundColor = '#dcfce7';
        setTimeout(() => {
          input.style.backgroundColor = '#f8fafc';
        }, 800);
      });
    }, 1500);
  });

  // Save Bill / Confirm
  btnSaveBill.addEventListener('click', (e) => {
    e.preventDefault();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    alert(`🎉 Success! ${sampleBillsData[activeBillKey].title} has been logged and split automatically across all 4 house members.`);
  });
}

function updateReceiptPreview(key) {
  const data = sampleBillsData[key];
  document.getElementById('receipt-vendor-logo').textContent = data.vendor;
  document.getElementById('receipt-no').textContent = data.no;
  document.getElementById('receipt-amount-display').textContent = `PKR ${data.amount}`;
  document.getElementById('receipt-date-display').textContent = data.date;
}

// Debt Simplifier Animation
function initDebtSimplifier() {
  const btnSimplify = document.getElementById('btn-simplify-debts');
  const simplifiedResult = document.getElementById('simplified-result');

  btnSimplify.addEventListener('click', () => {
    simplifiedResult.style.opacity = '0.4';
    simplifiedResult.style.transform = 'scale(0.98)';
    
    setTimeout(() => {
      simplifiedResult.style.opacity = '1';
      simplifiedResult.style.transform = 'scale(1)';
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }, 300);
  });
}

// Dashboard Table & Actions
function initDashboardActions() {
  const btnInviteCopy = document.getElementById('btn-invite-copy');
  
  if (btnInviteCopy) {
    btnInviteCopy.addEventListener('click', () => {
      navigator.clipboard.writeText('HIVE-7892-PK');
      btnInviteCopy.textContent = '✅ Code Copied!';
      setTimeout(() => {
        btnInviteCopy.textContent = '📋 Copy Invite Code';
      }, 2000);
    });
  }
}

// Global window function for inline Mark as Paid button
window.markMemberPaid = function(memberName) {
  if (memberName === 'Ali') {
    isPaidAli = true;
  }
  
  confetti({
    particleCount: 60,
    spread: 60,
    origin: { y: 0.5 }
  });

  // Re-render dashboard table status
  const rows = document.querySelectorAll('.table-row');
  rows.forEach(row => {
    if (row.textContent.includes(memberName)) {
      const statusPill = row.querySelector('.status-pill');
      const amountSpan = row.querySelector('.amount-pending');
      const actionBtn = row.querySelector('.btn-table-action');

      if (statusPill) {
        statusPill.className = 'status-pill status-paid';
        statusPill.textContent = 'Paid';
      }
      if (amountSpan) {
        amountSpan.className = 'amount-settled';
        amountSpan.textContent = 'PKR 0';
      }
      if (actionBtn) {
        actionBtn.className = 'btn-table-disabled';
        actionBtn.disabled = true;
        actionBtn.textContent = 'Settled';
      }
    }
  });

  // Update Pending Dues counter
  const dashPending = document.getElementById('dash-pending');
  if (dashPending) {
    if (isPaidAli) {
      dashPending.textContent = 'PKR 0';
      dashPending.className = 'text-success';
    }
  }
};

let chartsCreated = false;

// Expense Analytics Charts Rendering - Instant & Zero Delay
function initAnalyticsCharts() {
  if (chartsCreated) return;
  chartsCreated = true;

  // Run on next tick so tab switch is 100% immediate (0ms latency on click)
  setTimeout(() => {
    const ctxLine = document.getElementById('monthlyTrendChart');
    const ctxDonut = document.getElementById('categoryDonutChart');
    if (!ctxLine || !ctxDonut) return;

    // Line Chart for Monthly Trend
    new Chart(ctxLine, {
      type: 'line',
      data: {
        labels: ['July', 'August', 'September', 'October (Current)'],
        datasets: [
          {
            label: 'Electricity (KElectric)',
            data: [18500, 21000, 19200, 14850],
            borderColor: '#ff4b6e',
            backgroundColor: 'rgba(255, 75, 110, 0.12)',
            fill: true,
            tension: 0.35,
            borderWidth: 3,
            pointBackgroundColor: '#ff4b6e',
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: 'Internet & WiFi',
            data: [4500, 4500, 4500, 4500],
            borderColor: '#3b82f6',
            backgroundColor: 'transparent',
            tension: 0.1,
            borderWidth: 2,
            borderDash: [5, 5],
            pointBackgroundColor: '#3b82f6',
            pointRadius: 3,
            pointHoverRadius: 5
          },
          {
            label: 'Groceries & Household Supplies',
            data: [12000, 14500, 13200, 15850],
            borderColor: '#10b981',
            backgroundColor: 'transparent',
            tension: 0.3,
            borderWidth: 2,
            pointBackgroundColor: '#10b981',
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 750,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              padding: 12,
              font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return ` ${context.dataset.label}: PKR ${context.parsed.y.toLocaleString()}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(226, 232, 240, 0.6)'
            },
            ticks: {
              font: { family: 'Plus Jakarta Sans', size: 11 },
              callback: function(value) { return 'PKR ' + value.toLocaleString(); }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: { family: 'Plus Jakarta Sans', size: 11 }
            }
          }
        }
      }
    });

    // Donut Chart for Category Breakdown
    new Chart(ctxDonut, {
      type: 'doughnut',
      data: {
        labels: ['Electricity', 'Internet', 'Groceries', 'Gas & Others'],
        datasets: [{
          data: [14850, 4500, 15850, 3200],
          backgroundColor: ['#ff4b6e', '#3b82f6', '#10b981', '#8b5cf6'],
          hoverOffset: 6,
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 750,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              padding: 12,
              font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return ` ${context.label}: PKR ${context.parsed.toLocaleString()}`;
              }
            }
          }
        }
      }
    });
  }, 10);
}

// Language Switcher (EN <-> Roman Urdu / Bilingual)
function initLanguageToggle() {
  const langToggle = document.getElementById('lang-toggle');
  const langText = document.getElementById('current-lang-text');

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      if (currentLang === 'EN') {
        currentLang = 'UR';
        langText.textContent = 'UR';
        applyLanguageStrings('UR');
      } else {
        currentLang = 'EN';
        langText.textContent = 'EN';
        applyLanguageStrings('EN');
      }
    });
  }
}

const langStrings = {
  EN: {
    heroTitle: `The <span class="highlight-pink serif-italic">Smart</span> One,<br />The <span class="highlight-coral serif-italic">Right</span> One.`,
    heroSubtitle: `Functional and practical. Start tracking your household progress, split utility bills effortlessly, scan receipts with AI, and simplify roomie debts in the most efficient way possible.`,
    showcaseTitle: `Let Your HouseHives Do The Walking.`,
    showcaseSubtitle: `Manage your time on shared household bills and increase your living efficiency with smart automation, OCR bill reading, and debt simplification.`,
    middleTitle: `I Feel Like HouseHives Tonight.`
  },
  UR: {
    heroTitle: `Ghar Ka Hisaab <span class="highlight-pink">Aasan</span>,<br />Bachaay Aapka <span class="highlight-coral">Waqt & Paisa</span>.`,
    heroSubtitle: `Mushtarka kharchay darj karein, AI bill scanner se receipts parhein, aur smart settlement se baghair kisi uljhan ke bills split karein.`,
    showcaseTitle: `Ghar Ka Kharcha Automated Karein.`,
    showcaseSubtitle: `Internet, bijli aur ration ke bills ka khudkar hisaab kitaab. System khud bataye ga kis ne kis ko kitne paise dene hain.`,
    middleTitle: `Ghar Ka Mahol HouseHives Ke Saath.`
  }
};

function applyLanguageStrings(lang) {
  const data = langStrings[lang];
  if (data) {
    document.querySelector('.hero-title').innerHTML = data.heroTitle;
    document.querySelector('.hero-subtitle').textContent = data.heroSubtitle;
    document.querySelector('.showcase-section .section-title').textContent = data.showcaseTitle;
    document.querySelector('.showcase-section .section-subtitle').textContent = data.showcaseSubtitle;
    document.querySelector('.middle-center-title').textContent = data.middleTitle;
  }
}

// Smooth scroll buttons
function initQuickScrollButtons() {
  const btnHeroTry = document.getElementById('hero-try-ai');
  const btnHeroStart = document.getElementById('hero-get-started');

  if (btnHeroTry) {
    btnHeroTry.addEventListener('click', () => {
      document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (btnHeroStart) {
    btnHeroStart.addEventListener('click', () => {
      document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
    });
  }

  const btnCardScanner = document.getElementById('card-scanner');
  if (btnCardScanner) {
    btnCardScanner.addEventListener('click', () => {
      document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
      document.querySelector('[data-demo="scanner"]').click();
    });
  }

  const btnCardSettlement = document.getElementById('card-settlement');
  if (btnCardSettlement) {
    btnCardSettlement.addEventListener('click', () => {
      document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
      document.querySelector('[data-demo="settlement"]').click();
    });
  }

  const btnCardAnalytics = document.getElementById('card-analytics');
  if (btnCardAnalytics) {
    btnCardAnalytics.addEventListener('click', () => {
      document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
      document.querySelector('[data-demo="analytics"]').click();
    });
  }
}

// =====================================================================
// High-Performance Falling Real Currency Rain Canvas Particle System
// =====================================================================
function initCashRain() {
  const canvas = document.getElementById('cash-rain-canvas');
  if (!canvas) return;

  const heroSection = document.getElementById('why') || canvas.parentElement;
  const ctx = canvas.getContext('2d', { alpha: true });

  // State
  let animationFrameId = null;
  let isRunning = true;
  let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0;
  let height = 0;
  let dpr = 1;

  // 1. Real Currency Image Assets & Pink-Tinted SVG Fallback
  const billImageSources = ['/assets/bill-1.png', '/assets/bill-2.png'];
  const loadedBillImages = [];

  const fallbackSvgBill = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="84" viewBox="0 0 160 84">
  <rect x="2" y="2" width="156" height="80" rx="6" fill="#fbcfe8" stroke="#881337" stroke-width="2.5"/>
  <rect x="6" y="6" width="148" height="72" rx="4" fill="none" stroke="#be123c" stroke-width="1.5" stroke-dasharray="3 2" opacity="0.9"/>
  <rect x="10" y="10" width="140" height="64" rx="3" fill="none" stroke="#9f1239" stroke-width="1" opacity="0.8"/>
  <rect x="52" y="6" width="12" height="72" fill="#e11d48" opacity="0.45"/>
  <ellipse cx="80" cy="42" rx="24" ry="20" fill="#f472b6" stroke="#881337" stroke-width="1.8"/>
  <text x="80" y="47" font-family="-apple-system, sans-serif" font-size="14" font-weight="900" fill="#4c0519" text-anchor="middle">$100</text>
  <text x="14" y="21" font-family="-apple-system, sans-serif" font-size="10" font-weight="bold" fill="#881337">100</text>
  <text x="146" y="21" font-family="-apple-system, sans-serif" font-size="10" font-weight="bold" fill="#881337" text-anchor="end">100</text>
  <text x="14" y="73" font-family="-apple-system, sans-serif" font-size="10" font-weight="bold" fill="#881337">100</text>
  <text x="146" y="73" font-family="-apple-system, sans-serif" font-size="10" font-weight="bold" fill="#881337" text-anchor="end">100</text>
</svg>
`);

  // 2. Parallax Depth Layers (42 floating bills across 3 layers)
  // Higher Opacity and rich contrast for prominent background visibility
  const BASE_WIDTH = 112;
  const BASE_HEIGHT = 59;
  const bills = [];
  const sparkles = [];

  function createBill(layer, initialScatter = true) {
    let scale, opacity, speedY;

    if (layer === 'bg') {
      scale = 0.42 + Math.random() * 0.16;
      opacity = 0.42 + Math.random() * 0.16; // 0.42 - 0.58
      speedY = 0.7 + Math.random() * 0.5;
    } else if (layer === 'mid') {
      scale = 0.68 + Math.random() * 0.18;
      opacity = 0.65 + Math.random() * 0.15; // 0.65 - 0.80
      speedY = 1.3 + Math.random() * 0.7;
    } else {
      scale = 0.95 + Math.random() * 0.20;
      opacity = 0.82 + Math.random() * 0.14; // 0.82 - 0.96 (dark & visible)
      speedY = 2.2 + Math.random() * 0.9;
    }

    const img = loadedBillImages.length > 0 
      ? loadedBillImages[Math.floor(Math.random() * loadedBillImages.length)] 
      : null;

    return {
      layer,
      image: img,
      x: Math.random() * (width || window.innerWidth),
      y: initialScatter ? Math.random() * (height || 700) : -Math.random() * 80 - 40,
      scale,
      opacity,
      speedY,
      baseSpeedY: speedY,
      swayAngle: Math.random() * Math.PI * 2,
      swaySpeed: 0.016 + Math.random() * 0.020,
      swayAmp: 0.6 + Math.random() * 1.0,
      rot: (Math.random() - 0.5) * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.020,
      flipAngle: Math.random() * Math.PI * 2,
      flipSpeed: 0.024 + Math.random() * 0.035,
      windX: (Math.random() - 0.5) * 0.22
    };
  }

  // 3. Subtle Twinkling Sparkles and Soft Bokeh Spot Particles
  function createSparkle(initialScatter = true) {
    return {
      type: Math.random() > 0.4 ? 'sparkle' : 'bokeh',
      x: Math.random() * (width || window.innerWidth),
      y: initialScatter ? Math.random() * (height || 700) : -Math.random() * 30 - 10,
      radius: 1.5 + Math.random() * 2.5,
      speedY: 0.4 + Math.random() * 0.7,
      swayAngle: Math.random() * Math.PI * 2,
      swaySpeed: 0.02 + Math.random() * 0.025,
      swayAmp: 0.4 + Math.random() * 0.6,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.035 + Math.random() * 0.05,
      baseOpacity: 0.18 + Math.random() * 0.22, // 0.18 - 0.40
      color: Math.random() > 0.4 ? 'rgba(255, 77, 109, ' : (Math.random() > 0.5 ? 'rgba(255, 126, 121, ' : 'rgba(255, 255, 255, ')
    };
  }

  function initParticles() {
    bills.length = 0;
    sparkles.length = 0;
    // 14 Background, 18 Midground, 10 Foreground = 42 Bills total
    for (let i = 0; i < 14; i++) bills.push(createBill('bg', true));
    for (let i = 0; i < 18; i++) bills.push(createBill('mid', true));
    for (let i = 0; i < 10; i++) bills.push(createBill('fg', true));

    // 28 Twinkling sparkles and soft ambient bokeh spots
    for (let i = 0; i < 28; i++) sparkles.push(createSparkle(true));
  }

  // 4. Dynamic Window Resizing with devicePixelRatio Scaling
  function resizeCanvas() {
    const rect = heroSection.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const resizeObserver = new ResizeObserver(() => {
    resizeCanvas();
  });
  resizeObserver.observe(heroSection);

  // 5. High-Performance Motion Simulation & 3D Tumble/Flip Render Loop
  function renderFrame() {
    ctx.clearRect(0, 0, width, height);

    // A. Render subtle drifting bokeh spots and twinkling sparkles first
    for (let i = 0; i < sparkles.length; i++) {
      const s = sparkles[i];
      s.y += s.speedY;
      s.swayAngle += s.swaySpeed;
      s.x += Math.sin(s.swayAngle) * s.swayAmp;
      s.twinkle += s.twinkleSpeed;

      const alpha = s.baseOpacity * (0.55 + 0.45 * Math.sin(s.twinkle));

      ctx.save();
      ctx.translate(s.x, s.y);

      if (s.type === 'bokeh') {
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, s.radius * 2);
        grad.addColorStop(0, `${s.color}${alpha})`);
        grad.addColorStop(1, `${s.color}0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, s.radius * 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Delicate 4-point star glint
        const r = s.radius * 1.5;
        ctx.fillStyle = `${s.color}${alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.quadraticCurveTo(0, 0, 0, r);
        ctx.quadraticCurveTo(0, 0, -r, 0);
        ctx.quadraticCurveTo(0, 0, 0, -r);
        ctx.closePath();
        ctx.fill();

        // White starlight core
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.25, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Reset sparkle when falling past bottom
      if (s.y > height + 20) {
        s.y = -Math.random() * 30 - 10;
        s.x = Math.random() * width;
        s.twinkle = Math.random() * Math.PI * 2;
      }
    }

    // B. Render 3D tumbling pink-tinted currency notes
    for (let i = 0; i < bills.length; i++) {
      const p = bills[i];

      // Vertical downward velocity
      p.y += p.speedY;

      // Sinusoidal horizontal drift
      p.swayAngle += p.swaySpeed;
      p.x += Math.sin(p.swayAngle) * p.swayAmp + p.windX;

      // 3D Tumble/Flip & Rotation simulation
      p.rot += p.rotSpeed;
      p.flipAngle += p.flipSpeed;

      const flipCos = Math.cos(p.flipAngle);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      // 3D Tumble: scale(Math.cos(particle.flipAngle), 1) before drawImage
      ctx.scale(p.scale * flipCos, p.scale);
      ctx.globalAlpha = p.opacity;

      // Brand Highlighting: Rich deep burgundy/rose ambient shadow and crisp outline
      ctx.shadowColor = 'rgba(136, 19, 55, 0.45)';
      ctx.shadowBlur = 10 * p.scale;

      const billImg = p.image || loadedBillImages[0];
      if (billImg) {
        ctx.drawImage(billImg, -BASE_WIDTH / 2, -BASE_HEIGHT / 2, BASE_WIDTH, BASE_HEIGHT);

        // Reset shadowBlur so tint overlay doesn't cast duplicate shadow
        ctx.shadowBlur = 0;

        // Subtle specular tint overlay to give notes a rich, dark rose tone
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = 'rgba(159, 18, 57, 0.12)';
        ctx.fillRect(-BASE_WIDTH / 2, -BASE_HEIGHT / 2, BASE_WIDTH, BASE_HEIGHT);

        // Always reset composite operation
        ctx.globalCompositeOperation = 'source-over';
      }

      // Context reset guaranteed
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = 'source-over';
      ctx.restore();

      // Boundary Reset: when bill falls below viewport (y > canvas.height), smoothly reset above screen
      if (p.y > height + 60) {
        p.y = -Math.random() * 80 - 40;
        p.x = Math.random() * width;
        p.rot = (Math.random() - 0.5) * Math.PI;
        p.flipAngle = Math.random() * Math.PI * 2;
        p.swayAngle = Math.random() * Math.PI * 2;
        p.speedY = p.baseSpeedY * (0.9 + Math.random() * 0.2);
      }

      // Horizontal wrapping
      if (p.x < -80) p.x = width + 60;
      else if (p.x > width + 80) p.x = -60;
    }

    if (isRunning && !isReducedMotion) {
      animationFrameId = requestAnimationFrame(renderFrame);
    }
  }

  function startAnimation() {
    if (!animationFrameId && isRunning && !isReducedMotion) {
      animationFrameId = requestAnimationFrame(renderFrame);
    }
  }

  function stopAnimation() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  // 6. Battery & Performance Guardrails: Page Visibility API
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAnimation();
    } else if (isRunning && !isReducedMotion) {
      startAnimation();
    }
  });

  // Respect 'prefers-reduced-motion: reduce' media query
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  motionQuery.addEventListener('change', (e) => {
    isReducedMotion = e.matches;
    if (isReducedMotion) {
      stopAnimation();
      renderFrame(); // Single static snapshot for motion-sensitive users
    } else if (isRunning) {
      startAnimation();
    }
  });

  // 7. Real Currency Image Preloading (only start loop once images are loaded)
  let pendingCount = billImageSources.length;

  function onImagesReady() {
    initParticles();
    if (!isReducedMotion) {
      startAnimation();
    } else {
      renderFrame();
    }
  }

  billImageSources.forEach((src) => {
    const img = new Image();
    img.onload = () => {
      loadedBillImages.push(img);
      pendingCount--;
      if (pendingCount === 0) onImagesReady();
    };
    img.onerror = () => {
      // Inline SVG Fallback data URI
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        loadedBillImages.push(fallbackImg);
        pendingCount--;
        if (pendingCount === 0) onImagesReady();
      };
      fallbackImg.src = fallbackSvgBill;
    };
    img.src = src;
  });
}

