<div align="center">
  <img src="./public/Logo.jpg" width="200" height="200" style="border-radius: 20px" alt="Crescent Fitness Club Logo" />
  <h1>Crescent Fitness Club</h1>
  <p><b>"Dedicated to building a community of strength, discipline, and wellness."</b></p>
  <p>
    <a href="https://crescent-fitness-club.vercel.app"><b>🚀 View Live on Vercel</b></a>
  </p>
</div>

<br />

## 👥 Meet the Founders

<table align="center">
  <tr>
    <td align="center">
      <img src="./public/Mohamed%20Rashid.jpg" width="150" height="150" style="border-radius: 50%; object-fit: cover;" />
      <br />
      <b>Mohamed Rashid</b>
      <br />
      Founder
    </td>
    <td align="center">
      <img src="./public/Mohammed%20Waseem%20Ameen.jpeg" width="150" height="150" style="border-radius: 50%; object-fit: cover;" />
      <br />
      <b>Mohammed Waseem Ameen</b>
      <br />
      Founder
    </td>
    <td align="center">
      <img src="./public/Shoaib%20Ahmed%20Sheriff.jpg" width="150" height="150" style="border-radius: 50%; object-fit: cover;" />
      <br />
      <b>Shoaib Ahmed Sheriff</b>
      <br />
      Founder & Secretary
    </td>
  </tr>
</table>

---

## 💻 Technical Architecture

Crescent Fitness Club is a modern, responsive, and secure web application designed to manage fitness events and student registrations. 

### Tech Stack
- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS (with complex glassmorphism, custom micro-animations, and dynamic UI elements)
- **Icons**: Lucide React
- **Routing**: React Router DOM (v6)
- **Backend & Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

### Core Features
- **Dynamic Secure Auth**: Fully authenticated routing. The first 3 users to register are automatically granted strict `ADMIN` privileges via Postgres SQL Triggers.
- **Admin Dashboard**: Full CRUD (Create, Read, Update, Delete) capability on Events and Sub-Events, with integrated secure image uploading directly into Supabase Storage buckets.
- **Registration & Capacity Engine**:
  - Deep Postgres RPC integration (`get_sub_event_counts`) securely calculates real-time remaining capacities.
  - Users are locked out from registering when the `max_capacity` is reached.
  - "Limited slots remaining" visual warnings appear when capacities near maximum.
- **Strict Row Level Security (RLS)**: Enforces stringent data privacy. Students can only view their own registrations and cannot scrape others' data. Admins possess full data control.
- **Responsive Architecture**: Built completely mobile-first, utilizing CSS Grids, Flexbox, and backdrop-blur styling to maintain premium aesthetics across all device sizes.

---

## 🛠️ Local Development

To run this project locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shoaibahmed-2005/crescent_fitness_club.git
   cd crescent_fitness_club
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root and add your Supabase keys:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 🚀 Deployment

The `main` branch is connected to Vercel and deploys automatically upon push. Ensure that the Vercel Environment Variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) are correctly configured in the Vercel Dashboard for production.
