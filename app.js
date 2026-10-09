// Initialize Supabase Client using the credentials from your .env
// Note: In a real production environment, you might want to hide the ANON key behind an edge function if you want stricter rate limiting,
// but for a waitlist form, using the Anon Key with Row Level Security (RLS) is standard.

const SUPABASE_URL = 'https://wigqlfsmepqkktwjmwmh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpZ3FsZnNtZXBxa2t0d2ptd21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMDU3NDQsImV4cCI6MjEwNjc4MTc0NH0.Fyxg91uIhST-lnHWms776K6C0CPfsDxgZVHW01uw-PM';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    const form = document.getElementById('waitlist-form');
    const emailInput = document.getElementById('email');
    const submitBtn = document.getElementById('submit-btn');
    const messageDiv = document.getElementById('form-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        if (!email) return;

        // UI Loading state
        submitBtn.textContent = 'Joining...';
        submitBtn.disabled = true;
        messageDiv.className = 'form-message';
        messageDiv.style.display = 'none';

        try {
            // Insert into Supabase waitlist table
            // IMPORTANT: Ensure you have created a 'waitlist' table in your Supabase dashboard
            // with columns: id (uuid/serial), email (text, unique), created_at (timestamp)
            const { data, error } = await supabase
                .from('waitlist')
                .insert([
                    { email: email }
                ]);

            if (error) {
                // Handle unique constraint violation (already signed up)
                if (error.code === '23505') {
                    throw new Error("You're already on the waitlist! We'll be in touch soon.");
                }
                throw error;
            }

            // Success state
            messageDiv.textContent = '🎉 You are on the list! Welcome to the anti-shame club.';
            messageDiv.className = 'form-message success';
            messageDiv.style.display = 'block';
            form.reset();

        } catch (err) {
            // Error state
            messageDiv.textContent = err.message || 'Something went wrong. Please try again.';
            messageDiv.className = 'form-message error';
            messageDiv.style.display = 'block';
        } finally {
            submitBtn.textContent = 'Join the Waitlist';
            submitBtn.disabled = false;
        }
    });
});
