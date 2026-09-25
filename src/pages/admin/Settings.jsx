import { useState } from 'react'

const STORAGE_KEY = 'al-brr-admin-settings'

const DEFAULT_SETTINGS = {
  storeName: 'Al Brr Perfumes',
  storeEmail: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  gstin: '',
  currency: 'INR',

  allowOrders: true,
  orderNotifications: true,
  autoConfirmOrders: false,

  inventoryTracking: true,
  lowStockAlerts: true,
  defaultLowStockThreshold: 10,

  activityLogging: true,
  emailNotifications: true,
  paymentAlerts: true,
  customerAlerts: true,

  invoicePrefix: 'INV',
  orderPrefix: 'ORD',
  invoiceFooter: 'Thank you for shopping with Al Brr Perfumes.',
}

function loadSettings() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '{}'
    )

    return {
      ...DEFAULT_SETTINGS,
      ...(saved &&
      typeof saved === 'object' &&
      !Array.isArray(saved)
        ? saved
        : {}),
    }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

function Settings() {
  const [settings, setSettings] = useState(loadSettings)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setSettings((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))

    setSaved(false)
    setError('')
  }

  const handleSave = (event) => {
    event.preventDefault()

    if (!settings.storeName.trim()) {
      setError('Store name is required.')
      return
    }

    if (
      settings.storeEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        settings.storeEmail
      )
    ) {
      setError('Enter a valid store email address.')
      return
    }

    const threshold = Number(
      settings.defaultLowStockThreshold
    )

    if (
      Number.isNaN(threshold) ||
      threshold < 0
    ) {
      setError(
        'Low stock threshold must be 0 or greater.'
      )
      return
    }

    const cleanSettings = {
      ...settings,
      storeName: settings.storeName.trim(),
      storeEmail: settings.storeEmail.trim(),
      phone: settings.phone.trim(),
      address: settings.address.trim(),
      city: settings.city.trim(),
      state: settings.state.trim(),
      pincode: settings.pincode.trim(),
      gstin: settings.gstin.trim().toUpperCase(),
      invoicePrefix:
        settings.invoicePrefix.trim().toUpperCase() ||
        'INV',
      orderPrefix:
        settings.orderPrefix.trim().toUpperCase() ||
        'ORD',
      invoiceFooter: settings.invoiceFooter.trim(),
      defaultLowStockThreshold: threshold,
      updatedAt: new Date().toISOString(),
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(cleanSettings)
    )

    setSettings(cleanSettings)
    setSaved(true)
    setError('')
  }

  const resetSettings = () => {
    const confirmed = window.confirm(
      'Reset all admin settings to default values?'
    )

    if (!confirmed) return

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DEFAULT_SETTINGS)
    )

    setSettings({ ...DEFAULT_SETTINGS })
    setSaved(false)
    setError('')
  }

  return (
    <form
      className="admin-settings-page"
      onSubmit={handleSave}
    >
      {/* HEADER */}

      <div className="admin-settings-header">
        <div>
          <p className="admin-page-eyebrow">
            STORE CONFIGURATION
          </p>

          <h1>Settings</h1>

          <p className="admin-page-description">
            Configure your store, orders, inventory and
            administration preferences.
          </p>
        </div>

        <div className="admin-settings-header-actions">
          <button
            type="button"
            className="admin-settings-reset-btn"
            onClick={resetSettings}
          >
            Reset Defaults
          </button>

          <button
            type="submit"
            className="admin-settings-save-btn"
          >
            Save Settings
          </button>
        </div>
      </div>

      {/* STORE SETTINGS */}

      <section className="admin-settings-section">
        <div className="admin-settings-section-heading">
          <div className="admin-settings-section-icon">
            ◇
          </div>

          <div>
            <h2>Store Information</h2>
            <p>
              Basic business information used across the
              administration panel.
            </p>
          </div>
        </div>

        <div className="admin-settings-grid">
          <div className="admin-settings-field">
            <label>
              Store Name <strong>*</strong>
            </label>

            <input
              type="text"
              name="storeName"
              value={settings.storeName}
              onChange={handleChange}
              placeholder="Store name"
            />
          </div>

          <div className="admin-settings-field">
            <label>Store Email</label>

            <input
              type="email"
              name="storeEmail"
              value={settings.storeEmail}
              onChange={handleChange}
              placeholder="store@example.com"
            />
          </div>

          <div className="admin-settings-field">
            <label>Phone</label>

            <input
              type="tel"
              name="phone"
              value={settings.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="admin-settings-field">
            <label>Currency</label>

            <select
              name="currency"
              value={settings.currency}
              onChange={handleChange}
            >
              <option value="INR">
                INR — Indian Rupee (₹)
              </option>
            </select>
          </div>

          <div className="admin-settings-field admin-settings-field-full">
            <label>Business Address</label>

            <input
              type="text"
              name="address"
              value={settings.address}
              onChange={handleChange}
              placeholder="Enter business address"
            />
          </div>

          <div className="admin-settings-field">
            <label>City</label>

            <input
              type="text"
              name="city"
              value={settings.city}
              onChange={handleChange}
              placeholder="City"
            />
          </div>

          <div className="admin-settings-field">
            <label>State</label>

            <input
              type="text"
              name="state"
              value={settings.state}
              onChange={handleChange}
              placeholder="State"
            />
          </div>

          <div className="admin-settings-field">
            <label>Pincode</label>

            <input
              type="text"
              name="pincode"
              value={settings.pincode}
              onChange={handleChange}
              placeholder="Pincode"
            />
          </div>

          <div className="admin-settings-field">
            <label>GSTIN</label>

            <input
              type="text"
              name="gstin"
              value={settings.gstin}
              onChange={handleChange}
              placeholder="Enter GSTIN if applicable"
            />

            <small>
              Optional. Enter your actual registered GSTIN
              only.
            </small>
          </div>
        </div>
      </section>

      {/* ORDER SETTINGS */}

      <section className="admin-settings-section">
        <div className="admin-settings-section-heading">
          <div className="admin-settings-section-icon">
            □
          </div>

          <div>
            <h2>Order Settings</h2>
            <p>
              Configure how customer orders should be
              handled.
            </p>
          </div>
        </div>

        <div className="admin-settings-switch-list">
          <SettingSwitch
            name="allowOrders"
            title="Allow New Customer Orders"
            description="Allow customers to place new orders through the storefront."
            checked={settings.allowOrders}
            onChange={handleChange}
          />

          <SettingSwitch
            name="orderNotifications"
            title="Order Notifications"
            description="Enable order-related notifications inside the admin panel."
            checked={settings.orderNotifications}
            onChange={handleChange}
          />

          <SettingSwitch
            name="autoConfirmOrders"
            title="Auto Confirm Orders"
            description="Automatically mark newly placed orders as confirmed."
            checked={settings.autoConfirmOrders}
            onChange={handleChange}
          />
        </div>
      </section>

      {/* INVENTORY */}

      <section className="admin-settings-section">
        <div className="admin-settings-section-heading">
          <div className="admin-settings-section-icon">
            ▤
          </div>

          <div>
            <h2>Inventory Settings</h2>
            <p>
              Control stock tracking and low-stock
              warnings.
            </p>
          </div>
        </div>

        <div className="admin-settings-switch-list">
          <SettingSwitch
            name="inventoryTracking"
            title="Inventory Tracking"
            description="Track product stock quantities from the admin inventory."
            checked={settings.inventoryTracking}
            onChange={handleChange}
          />

          <SettingSwitch
            name="lowStockAlerts"
            title="Low Stock Alerts"
            description="Generate admin alerts when products reach their low-stock threshold."
            checked={settings.lowStockAlerts}
            onChange={handleChange}
          />
        </div>

        <div className="admin-settings-inline-field">
          <div>
            <strong>Default Low Stock Threshold</strong>
            <span>
              Used as the default warning level when a
              product has no custom threshold.
            </span>
          </div>

          <input
            type="number"
            name="defaultLowStockThreshold"
            min="0"
            step="1"
            value={settings.defaultLowStockThreshold}
            onChange={handleChange}
          />
        </div>
      </section>

      {/* ADMIN */}

      <section className="admin-settings-section">
        <div className="admin-settings-section-heading">
          <div className="admin-settings-section-icon">
            ⚙
          </div>

          <div>
            <h2>Admin & Notifications</h2>
            <p>
              Configure administrative monitoring and
              alert preferences.
            </p>
          </div>
        </div>

        <div className="admin-settings-switch-list">
          <SettingSwitch
            name="activityLogging"
            title="Activity Logging"
            description="Allow administrative actions to be recorded in the audit log when audit integration is enabled."
            checked={settings.activityLogging}
            onChange={handleChange}
          />

          <SettingSwitch
            name="emailNotifications"
            title="Email Notifications"
            description="Store the preference for administrative email notifications."
            checked={settings.emailNotifications}
            onChange={handleChange}
          />

          <SettingSwitch
            name="paymentAlerts"
            title="Payment Alerts"
            description="Show alerts for pending, failed and refunded payments."
            checked={settings.paymentAlerts}
            onChange={handleChange}
          />

          <SettingSwitch
            name="customerAlerts"
            title="Customer Alerts"
            description="Show administrative alerts for customer activity."
            checked={settings.customerAlerts}
            onChange={handleChange}
          />
        </div>
      </section>

      {/* DOCUMENT SETTINGS */}

      <section className="admin-settings-section">
        <div className="admin-settings-section-heading">
          <div className="admin-settings-section-icon">
            ▧
          </div>

          <div>
            <h2>Documents & Numbering</h2>
            <p>
              Store defaults for invoice and order
              numbering.
            </p>
          </div>
        </div>

        <div className="admin-settings-grid">
          <div className="admin-settings-field">
            <label>Invoice Prefix</label>

            <input
              type="text"
              name="invoicePrefix"
              value={settings.invoicePrefix}
              onChange={handleChange}
              placeholder="INV"
              maxLength="10"
            />
          </div>

          <div className="admin-settings-field">
            <label>Order Prefix</label>

            <input
              type="text"
              name="orderPrefix"
              value={settings.orderPrefix}
              onChange={handleChange}
              placeholder="ORD"
              maxLength="10"
            />
          </div>

          <div className="admin-settings-field admin-settings-field-full">
            <label>Invoice Footer</label>

            <textarea
              name="invoiceFooter"
              value={settings.invoiceFooter}
              onChange={handleChange}
              placeholder="Invoice footer message"
              rows="4"
            />
          </div>
        </div>
      </section>

      {/* SAVE STATE */}

      {error && (
        <div className="admin-settings-message error">
          <strong>Unable to save settings</strong>
          <span>{error}</span>
        </div>
      )}

      {saved && !error && (
        <div className="admin-settings-message success">
          <strong>Settings saved</strong>
          <span>
            Your administration preferences have been
            updated successfully.
          </span>
        </div>
      )}

      <div className="admin-settings-bottom-actions">
        <span>
          Settings are stored locally for the current
          application.
        </span>

        <button type="submit">
          Save Settings
        </button>
      </div>
    </form>
  )
}

function SettingSwitch({
  name,
  title,
  description,
  checked,
  onChange,
}) {
  return (
    <label className="admin-settings-switch-row">
      <div>
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <div className="admin-settings-switch">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
        />

        <span className="admin-settings-switch-track">
          <i />
        </span>
      </div>
    </label>
  )
}

export default Settings