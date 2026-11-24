# ApexBytesHub intake and CV field research

Date: 2026-11-24
Branch: `preview/base-2d455-apply-site-title`

## Findings applied

The form pass uses a small set of repeatable, service-relevant fields rather than asking for every possible personal detail.

- General client intake commonly starts with identity/contact details, requested service, project needs, goals, timeline, billing/contact details where relevant, and an acknowledgement/consent. Blueink's current client-intake guide explicitly recommends full name, company/contact details, preferred contact method, service requested, project needs, goals, timeline, budget where relevant, and consent, while warning that only genuinely needed information should be collected. [1]
- Digital intake guidance emphasizes categorized choices plus a short narrative field, validation before submission, conditional service-specific questions, and consent/release language. CharityTracker describes a categorized dropdown for the presenting need alongside open text, documentation checks, consent/signature, and conditional logic to keep forms short. [2]
- Official IRS material shows why government/tax workflows need separate identity and document-verification concepts: identity, foreign status, current documents, and supporting-document type are distinct requirements. The SARS-specific structure already supplied by ApexBytesHub is therefore retained rather than replaced with a generic form. [3] [4]
- Current CV guidance recommends clear standard sections: contact information, optional profile/summary, education, experience, and skills, with optional certifications, awards, licences, and references. Indeed notes that reverse-chronological experience is widely preferred, simple headings help ATS parsing, and a single-column readable structure avoids parsing problems. [5]

## Safe implementation decisions

1. Add a `select` field control to the shared field model. Use selects for standardized answers such as province/location, country, document format, paper size, colour, sidedness, device/platform, employment type, education type, driver licence, and preferred contact method.
2. Keep checkboxes only for genuinely multi-select answers, such as requested return types or supplied documents. Keep narrative textareas only for goals, explanations, responsibilities, design briefs, and notes.
3. Split combined data points into separate inputs. In particular, bank name, account type, account number, and branch code are separate fields; CV education is split into qualification, institution, and completion year; experience separates title, employer, employment type, dates, and responsibilities.
4. Add lightweight common intake details only where useful: preferred contact method, province, and country. Do not collect payment-card data, passwords, OTP values, or unnecessary sensitive information. OTPs remain an assisted SARS process and the existing authorisation language is preserved.
5. Preserve the supplied six-page SARS form structure and its SARS-specific questions. Improvements are limited to field separation, standardized answer controls, and clearer document-format choices.

## Sources

[1]: https://www.blueink.com/blog/client-intake-form "Blueink client intake form guide and template"
[2]: https://www.charitytracker.com/feeds/blog/client-intake "CharityTracker client intake form guidance"
[3]: https://www.irs.gov/tin/taxpayer-identification-numbers-tin "IRS taxpayer identification numbers"
[4]: https://www.irs.gov/tin/itin/itin-supporting-documents "IRS ITIN supporting documents"
[5]: https://www.indeed.com/career-advice/resumes-cover-letters/cv-format-guide "Indeed CV format guide"
