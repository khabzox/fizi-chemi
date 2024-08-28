<div align="center" class="flex justify-center items-center">
  <img src="https://fizi-chemi.vercel.app/images/logo.png" width="90" alt="FiziChemi Logo">
   <br /><br />
</div>



<p align="center">
<img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white">
<img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white">
<img src="https://img.shields.io/badge/threejs-black?style=for-the-badge&logo=three.js&logoColor=white">
<img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB">
<img src="https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white">
</p>

FiziChemi is a platform dedicated to helping students learn physics and chemistry through interactive tutorials and resources. This monorepo project leverages Next.js for the frontend, Tailwind CSS for styling, and Turborepo for managing multiple packages efficiently.

## TODO

- [ ] **Labo for Online Experiments**: Add a lab feature for online physics and chemistry experiments where students and teachers can collaborate.
- [ ] **Admin Sidebar Management**: Allow admin users to add a sidebar under each section.
- [ ] **Redesign Tutorials Page**: Revamp the tutorials page for a better user experience.
- [ ] **Subscription Feature**: Implement subscription options using Lemon Squeezy or PayPal.
- [ ] **Community Platform**: Build a community platform for students and teachers.
- [ ] **Whiteboard in Labo**: Include a whiteboard inside the lab for explanations and collaborative work.
- [ ] **Animations**: Add animations to enhance the user interface.
- [ ] **Chatbot in Labo**: Integrate a chatbot in the lab to assist students and teachers.

## Overview

FiziChemi offers a wide range of physics and chemistry tutorials designed for different educational levels. The platform aims to make learning these subjects more engaging and accessible.

## Monorepo Structure

This project uses a monorepo setup managed by Turborepo. The repository is organized into the following packages:

- **apps/nextjs-app**: The main Next.js application.
- **packages/ui**: Shared UI components, styled with Tailwind CSS.
- **packages/config**: Shared configuration files, including ESLint and Tailwind CSS config.
- **packages/utils**: Utility functions shared across the project.

## Getting Started


1. Clone the repository:

   ```bash
   git clone https://github.com/khabzox/fizi-chemi.git
   ```

2. Navigate to the project directory:

    ```bash
    cd fizi-chemi
    ```
    
3. Running the Project

    ```bash
    npm run dev
    ```

### License

This project is licensed under the MIT License. See the LICENSE file for details.
