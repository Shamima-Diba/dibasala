import { DeploymentStep } from '../types';

export const DEPLOYMENT_STEPS: DeploymentStep[] = [
  {
    title: '1. SSH into GCP VM Instance',
    titleBn: '১. গুগল ক্লাউড ভিএম সার্ভারে কানেক্ট করুন',
    description: 'Open Google Cloud Console > Compute Engine > VM instances and click SSH or use gcloud command.',
    descriptionBn: 'গুগল ক্লাউড কনসোলের Compute Engine থেকে আপনার VM Instance এ SSH বাটনে ক্লিক করে টার্মিনাল খুলুন।',
    command: 'gcloud compute ssh --zone YOUR_ZONE YOUR_VM_NAME'
  },
  {
    title: '2. Install Node.js 20 LTS & Git',
    titleBn: '২. নোড.জেএস (Node.js 20) ও গিট ইনস্টল করুন',
    description: 'Install Node.js 20 and build essential tools on Ubuntu/Debian VM.',
    descriptionBn: 'সার্ভারে Node.js এবং প্রয়োজনীয় ডেভেলপমেন্ট টুলস ইনস্টল করুন।',
    command: 'curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs git build-essential'
  },
  {
    title: '3. Clone & Setup JUNIOR GEMINI',
    titleBn: '৩. প্রজেক্ট ফাইল ডাউনলোড ও এনভাইরনমেন্ট সেটআপ',
    description: 'Clone repository, install dependencies, and create .env file with your GEMINI_API_KEY.',
    descriptionBn: 'প্রজেক্ট ফোল্ডারে প্রবেশ করে প্যাকেজ ইনস্টল করুন এবং GEMINI_API_KEY সেট করুন।',
    command: `git clone YOUR_REPO_URL junior-gemini
cd junior-gemini
npm install
echo 'GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"' > .env
npm run build`
  },
  {
    title: '4. Keep Running Continuously with PM2 Process Manager',
    titleBn: '৪. PM2 দিয়ে সার্ভার নিরবচ্ছিন্ন (Continuous) চালু রাখুন',
    description: 'PM2 ensures JUNIOR GEMINI automatically restarts on server reboot or crashes.',
    descriptionBn: 'PM2 প্রসেস ম্যানেজার ব্যবহার করলে আপনার ভিএম সার্ভার রিস্টার্ট হলেও অ্যাপ স্বয়ংক্রিয়ভাবে চালু থাকবে।',
    command: `sudo npm install -g pm2
pm2 start dist/server.cjs --name "junior-gemini"
pm2 startup
pm2 save`
  },
  {
    title: '5. Docker Container Deployment (Alternative)',
    titleBn: '৫. ডকার কন্টেইনার মেথড (বিকল্প পদ্ধতি)',
    description: 'Single-command Docker container startup for GCP VM.',
    descriptionBn: 'ডকার কন্টেইনার দিয়ে মাত্র এক কম্যান্ডে সার্ভার চালু করার উপায়।',
    command: `docker build -t junior-gemini .
docker run -d -p 3000:3000 -e GEMINI_API_KEY="YOUR_GEMINI_KEY" --name junior-gemini-app junior-gemini`
  }
];
