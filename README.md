# Idea Vault

A visual idea management system for capturing, organizing, and vetting ideas across multiple categories. Built with React, Supabase, and deployed on Vercel.

**Live Demo:** [idea-vault-nu.vercel.app](https://idea-vault-nu.vercel.app)

---

## The Problem

You generate 10-20 ideas weekly across different categories (products, work tools, learning resources, fun projects). Existing tools are either too basic or don't match how you think visually. Idea Vault solves this with a beautiful, organized system that helps you capture and evaluate ideas systematically.

---

## Features

✨ **Capture Ideas Instantly** — Quick-capture form with title, description, and category  
🔍 **Search & Filter** — Find ideas by keyword or type (Product, Work Tools, Learning, Fun)  
✏️ **Edit & Organize** — Update ideas anytime with modal editor  
🗑️ **Delete Ideas** — Remove ideas you've decided against  
⭐ **Rate on 4 Criteria** — Vet ideas with Excitement, Impact, Feasibility, and Cost/Resources scales (1-5)  
📊 **Auto-Calculated Scores** — Overall score averages your ratings  
🌍 **Real-Time Sync** — Changes sync instantly via Supabase  
📱 **Mobile Responsive** — Works beautifully on phones, tablets, and desktops  
🎨 **Beautiful UI** — Cultivated Emergence design philosophy with vibrant florals and organic forms

---

## Tech Stack

**Frontend:**
- React (Hooks: useState, useEffect)
- CSS3 (CSS Variables, Flexbox, Grid, Animations)
- Responsive Design

**Backend:**
- Supabase (PostgreSQL + Real-Time)
- Row Level Security (RLS)
- REST API

**Deployment:**
- Vercel (Auto-deploy from GitHub)
- GitHub (Version Control)

---

## How It Works

### 1. Capture
Write your idea in seconds—title, optional description, and category.

### 2. Organize
Search and filter ideas. All changes sync to the database instantly.

### 3. Vet
Click "Vet" on any idea. Rate it on 4 scales. Your overall score calculates automatically.

### 4. Decide
Your ratings help you identify which ideas are worth pursuing.

---

## Data Model