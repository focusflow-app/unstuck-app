// Initialize Supabase Client
const SUPABASE_URL = 'https://wigqlfsmepqkktwjmwmh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpZ3FsZnNtZXBxa2t0d2ptd21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMDU3NDQsImV4cCI6MjEwNjc4MTc0NH0.Fyxg91uIhST-lnHWms776K6C0CPfsDxgZVHW01uw-PM';

const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

document.addEventListener('DOMContentLoaded', () => {
    // ── Smooth scrolling for anchor links ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ── Interactive Companion Mascot Demo ──
    const companionFace = document.getElementById('companion-face');
    const companionSpeech = document.getElementById('companion-speech');
    const moodButtons = document.querySelectorAll('.mood-btn');

    const MOOD_MESSAGES = {
        idle: {
            face: '😊',
            msg: '"Hey! What are you avoiding right now? Type it below — I will find a tiny first step we can do together."'
        },
        focus: {
            face: '🧠',
            msg: '"25 minutes together? I\'ll stay right here beside you. Phone down, we got this."'
        },
        break: {
            face: '☕',
            msg: '"Time to unclamp your jaw, roll your shoulders, and take a sip of water. Great focus!"'
        },
        celebrating: {
            face: '🎉',
            msg: '"You showed up and did the work! That counts as a real win. No streak pressure, just this win."'
        },
        lowEnergy: {
            face: '😴',
            msg: '"Looks like battery is low today. That is 100% fine. Let\'s pick just ONE tiny 2-minute step."'
        }
    };

    moodButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            moodButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const mood = btn.dataset.mood;
            const data = MOOD_MESSAGES[mood] || MOOD_MESSAGES.idle;
            if (companionFace) companionFace.textContent = data.face;
            if (companionSpeech) companionSpeech.textContent = data.msg;
        });
    });

    // ── Instant "What are you avoiding?" Slicer ──
    const avoidForm = document.getElementById('instant-slice-form');
    const avoidInput = document.getElementById('avoid-input');
    const sliceResult = document.getElementById('slice-result');
    const stepTitle = document.getElementById('result-step-title');
    const stepDesc = document.getElementById('result-step-desc');
    const sliceBtn = document.getElementById('slice-btn');

    const generateTinyStep = (goal) => {
        const lower = goal.toLowerCase();
        if (lower.includes('clean') || lower.includes('room') || lower.includes('desk')) {
            return {
                title: "Pick up 3 pieces of trash and put them in the bin.",
                desc: "Don't organize anything yet. Just 3 pieces. Takes 45 seconds."
            };
        }
        if (lower.includes('essay') || lower.includes('write') || lower.includes('report') || lower.includes('doc')) {
            return {
                title: "Open the blank document and type the title.",
                desc: "Nothing else. Don't write paragraph 1. Just open the window."
            };
        }
        if (lower.includes('email') || lower.includes('inbox') || lower.includes('reply')) {
            return {
                title: "Open your email tab and star the 1 message you need to read.",
                desc: "Don't reply yet. Just locate it and star it."
            };
        }
        if (lower.includes('tax') || lower.includes('bill') || lower.includes('finance')) {
            return {
                title: "Find the login page and sign in.",
                desc: "Step away right after if you need to. Just getting logged in is 50% of the friction."
            };
        }
        if (lower.includes('study') || lower.includes('read') || lower.includes('chapter')) {
            return {
                title: "Open to the page and read only the first bold heading.",
                desc: "Close the book if you want, or keep reading. The initiation is done."
            };
        }
        return {
            title: `Put your hands on the tools needed for "${goal.slice(0, 30)}".`,
            desc: "Spend exactly 60 seconds setting it up. No pressure to finish today."
        };
    };

    if (avoidForm) {
        avoidForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const goal = avoidInput.value.trim();
            if (!goal) return;

            sliceBtn.innerHTML = '<span>Slicing...</span>';
            setTimeout(() => {
                const step = generateTinyStep(goal);
                stepTitle.textContent = step.title;
                stepDesc.textContent = step.desc;
                sliceResult.style.display = 'block';
                sliceBtn.innerHTML = '<span>UnStuck Me</span><span class="btn-arrow">→</span>';

                // Update companion speech
                if (companionFace) companionFace.textContent = '🧠';
                if (companionSpeech) companionSpeech.textContent = `"Here is our tiny next step. Can you do this one tiny physical action with me?"`;
            }, 300);
        });
    }

    // Demo timer button
    const demoTimerBtn = document.getElementById('demo-timer-btn');
    if (demoTimerBtn) {
        demoTimerBtn.addEventListener('click', () => {
            demoTimerBtn.textContent = '⏱️ Timer Started: 25:00 together!';
            if (companionFace) companionFace.textContent = '👾';
            if (companionSpeech) companionSpeech.textContent = `"Timer started! I will sit right here. Let's make progress without stress."`;
        });
    }

    // Demo water button
    const demoWaterBtn = document.getElementById('demo-water-btn');
    if (demoWaterBtn) {
        demoWaterBtn.addEventListener('click', () => {
            demoWaterBtn.textContent = '💧 Water Reminder Set (+20m)';
            if (companionFace) companionFace.textContent = '💧';
            if (companionSpeech) companionSpeech.textContent = `"Tiny reminder: take a sip of cool water right now. Your brain needs fuel."`;
        });
    }

    // ── Waitlist Form Submission ──
    const form = document.getElementById('waitlist-form');
    const emailInput = document.getElementById('email');
    const submitBtn = document.getElementById('submit-btn');
    const messageDiv = document.getElementById('form-message');

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = emailInput.value.trim();
                if (!email) return;

                submitBtn.textContent = 'Joining...';
                submitBtn.disabled = true;
                messageDiv.className = 'form-message';
                messageDiv.style.display = 'none';

                            try {
                                if (supabase) {
                                    const { error } = await supabase.from('waitlist').insert([{ email }]);
                                    if (error && error.code !== '23505') throw error;
                                }
                                messageDiv.textContent = '🎉 You are on the list! Welcome to the focus companion club.';
                                messageDiv.className = 'form-message success';
                                messageDiv.style.display = 'block';
                                form.reset();
                            } catch (err) {
                                messageDiv.textContent = err.message || 'Something went wrong. Please try again.';
                                messageDiv.className = 'form-message error';
                                messageDiv.style.display = 'block';
                            } finally {
                                submitBtn.textContent = 'Get Android Invite';
                                submitBtn.disabled = false;
                            }
        });
}
});
