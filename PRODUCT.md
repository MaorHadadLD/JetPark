# Product

<!-- impeccable:product-schema 1 -->

> Written from the client's brief (no separate interview round; the brief asked to proceed directly). Facts below are only what the brief states.

## Platform

web

## Stack

Next.js (App Router), TypeScript, Tailwind CSS — specified by the client.

## Users

Travellers flying abroad from Israel who drive to the airport and want to avoid parking logistics. Hebrew speakers; RTL.

## Product Purpose

JetPark is a parking service for travellers. A JetPark representative receives the car from the customer at the terminal before the flight, and returns the car to the customer at the terminal after the return flight. The site must make that service understood and get visitors to send a coordination request.

## Positioning

Two meetings, both at the terminal: hand over the car before departure, get it back on return. The traveller never deals with the car between those two points.

## Capabilities and Constraints

- Price list (from the owner, 2026-10-25): up to 5 days 350 ILS, each additional day 60 ILS. Kept in src/config/pricing.ts. No phone number or booking API exists yet.
- The site collects a coordination request (handover and return date/time) that the visitor can copy or share. It is not a confirmed booking.
- Contact details live in one config file (`src/config/site.ts`) to be completed later.
- Undecided / not to be claimed: insurance, security, cameras, operating hours, parking lot location, wait times, availability, car wash. (Terminals 1 and 3 at Ben Gurion and the price list were confirmed by the owner.)

## Brand Commitments

Name: JetPark. Concept line from the brief: "החופשה מתחילה בטרמינל. אנחנו ממשיכים עם הרכב."

## Evidence on Hand

None. No reviews, customer counts, partnerships, photos of staff, lot or vehicles. Atmosphere photographs only, credited.

## Product Principles

1. Show the service, don't describe it.
2. Never promise what has not been confirmed.
3. Coordination should be one calm step away from anywhere on the page.

## Accessibility & Inclusion

Full Hebrew RTL, keyboard and touch operation, visible focus, good contrast, prefers-reduced-motion support.
