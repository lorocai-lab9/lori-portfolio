# Espoirer — verbatim content from leicai99.com

> Source: <https://www.leicai99.com/projects/design-esp-mobile>
> Maps to: `/projects/espoirer.html`

---

# Designing a 0→1 Driver App to Improve Last-Mile Delivery Accuracy

## 01 / Project Overview

Espoirer is a logistics company focused on improving last-mile delivery through automation and digitalization.

This project involved designing a 0→1 driver-facing delivery app, where our team led the design of the package list and map views to help drivers manage high-volume deliveries accurately and efficiently.

The launched product increased delivery success rates from 92% to 97% and more than doubled Espoirer's order volume, creating a measurable impact on daily operations and business growth.

## 02 / Problems

Espoirer's original workflow (Manager system plus paper version) lacked a clear, driver-oriented interface for managing high-volume deliveries. Drivers faced **unclear information hierarchy**, repetitive operational steps, and address formats that did not align with local delivery realities, especially in Japan.

These issues resulted in delivery errors, slower completion times, and poor traceability between drivers and the administrative system.

## 03 / Design Goals

- Help drivers quickly identify the correct package and destination
- Optimize workflows for both experienced drivers and first-time users
- Reduce delivery errors through structured, scannable information
- Support Japanese address formats and delivery custom
- Maintain system-wide data integrity with the admin platform

## 04 / Design Challenges

1. Unclear information hierarchy in high-density delivery lists
2. Designing primarily for experienced drivers who value speed over guidance
3. Localization challenges, including Japanese address formatting and communication norms

## Information

- **Type** — Mobile App Design
- **Device** — iOS and Android
- **My Role** — Design Lead in team
- **Design Methods** — Contextual Inquiry | Task Analysis | Participatory Design | Card Sorting | Cognitive Walkthrough | MVP (Minimum Viable Product) Planning | Iterative Design

---

## How we first understand the project?

### 01 Who are the direct users?

We conducted 8 in-depth interviews with local delivery drivers and performed contextual inquiry during real delivery routes.

> Key Insights: _Drivers do not "read" the app — they scan, memorize, and act._

### 02 User Journey

Since it is a 0-1 design, we create a journey map after contextual inquiry to meet the localized requirements. In the user journey map, each stop offered a glimpse into the challenges that couriers like Hiroshi faced, drawing a path that demanded a new blueprint for efficiency and satisfaction.

### 03 Summary of Pain points

**Planning** — Couriers encounter difficulties in filtering and sorting delivery information, and overwhelmed with various delivery statuses.

**Navigation** — Couriers' local knowledge clashes with app-generated route plans.

**DeliveryInfo** — Couriers struggle to quickly locate important delivery information due to a cluttered and disorganized dashboard layout.

**Localization** — The app's design and user experience do not align with cultural norms and aesthetics, leading to a disconnect with Japanese users.

### 04 Competitive Analysis

We analyzed the best courier apps in the U.S. and in Japan. Combine the special needs in the Japanese market, got instructional insights and opportunities.

And through the competitive research, we summarized insights:

**Planning**
- Track or show order delivery status by different filters
- Provide map integration

**Navigation**
- Allow driver to customize the routes
- Balance experienced and new drivers

**Delivery**
- Simplify user flow
- Provide real-time updated & recipients notification

**Localization**
- Able to track or show order delivery status by different filters
- Provide map integration

### 05 User Flow Redesign

#### 01 Whole Flow

Based on the research findings, we created a 102 step complete user flow.

#### 02 Plan Part

#### 03 Delivery Part

---

## Design process

We defined four main design challenges, with the HMWs:

### 01 Information Display

### 02 Intricate logical Relationships

How might we design a List View seamlessly facilitates delivery completion for couriers?

Especially considering the intricate logical relationships between recipients and packages:

- Different buildings within the same area
- Different rooms within the same building
- Different recipients within the same room
- Multiple packages for the same recipient

### 03 Iteration on Cards

**Final Design** — *(image)*

### 04 Iteration on List View

**Final Design** — *(image)*

---

## Map View iterations

### 01 Iteration on Map View

### 02 Iteration on Map view — Information Card

### 03 Iteration on Map view — Selection

**Final Design**

- Tag order numbers correspond with card information, as well matching the list order numbers, for better adapt to experienced drivers' habit
- Visual style of tag and filter is consistent with list view
- Card would disappear if no tag and filter is selected

---

## Personalization

### 01 Personalize Delivery Habits

### Optionalize Navigation Function

## Localization

### 01 Special formatting of Japanese addresses

### 02 Font Choice to balance multiple languages

## Design System

---

## Post Project

### Next Steps

- According to the performance data obtained from user testing by Expoirer, further improve the user experience.

### Takeaways

- The internal business logic of 2B products is very complex, and there are many intersection points. It is a big challenge to ensure that the data the process is correct. e.g. When scanning before delivery, if the driver scans several packages in a certain range in advance, so the location is inaccurate and the error would be reported, should the error be judged after the delivery method or give the driver the authority to manually override the error report?
- To design and develop a product from 0-1, different groups are responsible for different feature sets, and the synchronous design needs to consider the smooth flow of connection with feature sets of other groups.
