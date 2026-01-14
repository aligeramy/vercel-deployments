# Security Policy

## 🔒 Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## 🛡️ Security Best Practices

This extension follows security best practices:

- **Local Storage Only**: API tokens are stored locally in Chrome's storage
- **No External Servers**: All requests go directly to Vercel's API
- **No Data Collection**: We don't collect or transmit any user data
- **HTTPS Only**: All API requests use secure HTTPS connections

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability, please **DO NOT** open a public issue. Instead:

1. **Email**: Send details to [your-email@example.com] (replace with your actual email)
2. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work with you to address the issue.

## ✅ Security Checklist

- [x] API tokens stored locally only
- [x] No third-party analytics
- [x] No external dependencies
- [x] HTTPS-only API calls
- [x] Input validation
- [x] XSS protection (HTML escaping)

## 📋 Known Security Considerations

- **API Token Storage**: Tokens are stored in Chrome's local storage. While this is standard practice, users should be aware that anyone with access to their Chrome profile can view stored tokens.
- **Browser Extension Permissions**: The extension only requests necessary permissions (`storage` and `host_permissions` for Vercel API).

## 🔐 Recommendations for Users

1. Use a strong, unique API token
2. Regularly rotate your API tokens
3. Don't share your Chrome profile with untrusted users
4. Review the extension's permissions before installation

---

**Last Updated**: 2024
