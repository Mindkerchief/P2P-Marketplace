# <img src="https://github.com/Mindkerchief/P2P-Marketplace/blob/a60ef41c305543fda190e4f4f389d19c784872fb/frontend/public/logo.png" width="28" alt="Logo Thumbnail"> P2P Marketplace ![p2p-badge][p2p-badge]
A peer-to-peer secondhand marketplace for buying, selling, renting, and offering services. Built around user trust to make decluttering easy and close the safety gap left open by existing marketplaces.

## Table of Contents
- [Features](#features)
- [Security](#security)
- [Acknowledgments](#acknowledgments)

## Features
<img src="https://github.com/Mindkerchief/P2P-Marketplace/blob/7e06606c902b47527eaefd706627c8554d679dcd/docs/login.png" width="350" alt="Login"> &nbsp;
<img src="https://github.com/Mindkerchief/P2P-Marketplace/blob/7e06606c902b47527eaefd706627c8554d679dcd/docs/profile.png" width="350" alt="Profile">

- **User Management** - Register, verify, and manage user accounts and profiles.

<img src="https://github.com/Mindkerchief/P2P-Marketplace/blob/7e06606c902b47527eaefd706627c8554d679dcd/docs/home.png " width="350" alt="Homepage"> &nbsp;
<img src="https://github.com/Mindkerchief/P2P-Marketplace/blob/7e06606c902b47527eaefd706627c8554d679dcd/docs/listing.png" width="350" alt="Listing Page">

- **Listing** - Create, browse, and discover items, rentals, or services for free.

<img src="https://github.com/Mindkerchief/P2P-Marketplace/blob/7e06606c902b47527eaefd706627c8554d679dcd/docs/conversation.png" width="350" alt="Conversation"> &nbsp;
<img src="https://github.com/Mindkerchief/P2P-Marketplace/blob/7e06606c902b47527eaefd706627c8554d679dcd/docs/scheduling.png" width="350" alt="Scheduling">

- **Messaging** - Chat directly with buyers and sellers in-app.
- **Transaction** - Provide record of buying, selling, and rental transactions between users.

<img src="https://github.com/Mindkerchief/P2P-Marketplace/blob/7e06606c902b47527eaefd706627c8554d679dcd/docs/review.png" width="350" alt="Review"> &nbsp;
<img src="https://github.com/Mindkerchief/P2P-Marketplace/blob/7e06606c902b47527eaefd706627c8554d679dcd/docs/report.png" width="350" alt="Report">

- **Reviewing** - Rate and review other users after a completed transaction.
- **Reporting** - Flag suspicious listings, users, or conversations for moderation.

<img src="https://github.com/Mindkerchief/P2P-Marketplace/blob/7e06606c902b47527eaefd706627c8554d679dcd/docs/verification-form.png" width="350" alt="Verification Form"> &nbsp;
<img src="https://github.com/Mindkerchief/P2P-Marketplace/blob/7e06606c902b47527eaefd706627c8554d679dcd/docs/notification.png" width="350" alt="Notification">

- **User Verification** - Verify user identity to build trust across the platform.
- **Notification** - Get notified about messages, transactions, and account activity.

<img src="https://github.com/Mindkerchief/P2P-Marketplace/blob/7e06606c902b47527eaefd706627c8554d679dcd/docs/admin-dashboard.png" width="350" alt="Admin Dashboard"> &nbsp;
<img src="https://github.com/Mindkerchief/P2P-Marketplace/blob/7e06606c902b47527eaefd706627c8554d679dcd/docs/admin-verification-review.png" width="350" alt="Admin Dashboard">

- **Admin Dashboard** - Monitor, manage, and moderate users, listings, and reports.
- **Listing Moderation** - Automatically screen listings for prohibited or scam-related content.

## Security
- Route Protection
- Input Validation
- Rate Limiting
- Password & Session ID Hashing (Bcrypt)
- PII Data Encryption (AES-GCM)
- Listing Moderation (Aho–Corasick Algorithm)

## Acknowledgments
### Frontend
- **[Next.js][nextjs]**: For the React framework powering the frontend.
- **[Tailwind CSS][tailwind]**: For utility-first CSS styling.
- **[shadcn/ui][shadcn]**: For accessible, reusable UI components.
- **[Phosphor Icons][phosphor]** & **[Lucide][lucide]**: For the icon sets used across the UI.
- **[TanStack Query][tanstack-query]**: For data fetching, caching, and state synchronization.
- **[browser-image-compression][image-compression]**: For client-side image compression on uploads.
- **[Biome][biomejs]**: For linting and formatting.
### Backend
- **[Fiber][fiber]**: For the Go web framework powering the backend.
- **[GORM][gorm]**: For ORM and database management.
- **[Tink][tink]**: For the cryptography library powering password and PII data encryption.
- **[Aho-Corasick][ahocorasick]**: For fast, pattern-based listing moderation.
- **[Badwords List][badwords]** & **[Filipino Badwords List][filipino-badwords]**: For list of bad words in English and Filipino.
- **[PostgreSQL][postgresql]**: For DBMS.

<!-- Reference -->
[p2p-badge]: https://img.shields.io/badge/Website-Marketplace-2563EB

[nextjs]: https://nextjs.org/docs
[tailwind]: https://tailwindcss.com/docs/installation
[shadcn]: https://ui.shadcn.com/docs/components
[phosphor]: https://phosphoricons.com
[lucide]: https://lucide.dev/icons/
[tanstack-query]: https://tanstack.com/query/latest/docs/framework/react/overview
[image-compression]: https://www.npmjs.com/package/browser-image-compression
[biomejs]: https://www.npmjs.com/package/@biomejs/biome
[fiber]: https://github.com/gofiber/fiber
[gorm]: https://gorm.io/docs/
[tink]: https://github.com/tink-crypto/tink-go
[ahocorasick]: https://github.com/cloudflare/ahocorasick
[postgresql]: https://www.postgresql.org/download/
[badwords]: https://github.com/nyvorin/badwords-list
[filipino-badwords]: https://github.com/jromest/filipino-badwords-list
