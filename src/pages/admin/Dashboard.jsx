import { Link } from 'react-router-dom'

const recentOrders = [
  {
    id: '#ORD-1024',
    customer: 'Ayesha Khan',
    amount: 2499,
    status: 'Delivered',
    time: '2 hours ago',
  },
  {
    id: '#ORD-1023',
    customer: 'Fatima Noor',
    amount: 3200,
    status: 'Shipped',
    time: '4 hours ago',
  },
  {
    id: '#ORD-1022',
    customer: 'Sara Ahmed',
    amount: 1850,
    status: 'Processing',
    time: '6 hours ago',
  },
  {
    id: '#ORD-1021',
    customer: 'Zainab Ali',
    amount: 2750,
    status: 'Delivered',
    time: '8 hours ago',
  },
  {
    id: '#ORD-1020',
    customer: 'Ruqayya Siddiqui',
    amount: 1299,
    status: 'Cancelled',
    time: '10 hours ago',
  },
]

const topProducts = [
  { name: 'Al-Durrat', sold: 42, percent: 100 },
  { name: 'Gen-Z7', sold: 28, percent: 67 },
  { name: 'Alfa-Men', sold: 18, percent: 43 },
  { name: 'Saji Oudh', sold: 15, percent: 36 },
]

const statusData = [
  { name: 'Delivered', value: 58, className: 'delivered' },
  { name: 'Shipped', value: 23, className: 'shipped' },
  { name: 'Processing', value: 12, className: 'processing' },
  { name: 'Cancelled', value: 7, className: 'cancelled' },
]

const categoryData = [
  { name: 'Noir', value: 48 },
  { name: 'Rouge', value: 37 },
  { name: 'Others', value: 15 },
]

function StatCard({ icon, label, value, change, note, tone }) {
  return (
    <article className="admin-stat-card">
      <div className={`admin-stat-icon ${tone}`}>
        {icon}
      </div>

      <div className="admin-stat-copy">
        <span>{label}</span>

        <strong>{value}</strong>

        <div className="admin-stat-bottom">
          <b>↑ {change}</b>
          <small>{note}</small>
        </div>
      </div>
    </article>
  )
}

function StatusBadge({ status }) {
  return (
    <span
      className={`admin-status-badge ${status
        .toLowerCase()
        .replaceAll(' ', '-')}`}
    >
      {status}
    </span>
  )
}

function Dashboard() {
  return (
    <div className="admin-dashboard">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="admin-dashboard-heading">
        <div>
          <p className="admin-page-eyebrow">
            OVERVIEW
          </p>

          <h1>Dashboard</h1>

          <p>
            Welcome back. Here's what's happening with your
            perfume store today.
          </p>
        </div>

        <div className="admin-dashboard-date">
          <span>◷</span>
          24 SEP 2026
        </div>
      </div>


      {/* =====================================================
          TOP AREA
      ====================================================== */}

      <div className="admin-dashboard-top">

        <div className="admin-dashboard-main-column">

          {/* STATS */}

          <div className="admin-stats-grid">

            <StatCard
              icon="□"
              label="Total Orders"
              value="124"
              change="12%"
              note="vs. last 7 days"
              tone="green"
            />

            <StatCard
              icon="₹"
              label="Total Revenue"
              value="₹1,48,320"
              change="18%"
              note="vs. last 7 days"
              tone="gold"
            />

            <StatCard
              icon="◇"
              label="Products Sold"
              value="198"
              change="15%"
              note="vs. last 7 days"
              tone="blue"
            />

            <StatCard
              icon="♙"
              label="New Customers"
              value="32"
              change="28%"
              note="vs. last 7 days"
              tone="burgundy"
            />

          </div>


          {/* =================================================
              CHARTS
          ================================================== */}

          <div className="admin-dashboard-chart-row">

            {/* SALES OVERVIEW */}

            <section className="admin-dashboard-card admin-sales-card">

              <div className="admin-card-header">
                <div>
                  <h2>Sales Overview</h2>

                  <p>Total sales in the last 7 days</p>
                </div>

                <select defaultValue="7">
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 3 months</option>
                </select>
              </div>


              <div className="admin-sales-chart">

                <div className="admin-chart-y-labels">
                  <span>40K</span>
                  <span>30K</span>
                  <span>20K</span>
                  <span>10K</span>
                  <span>0</span>
                </div>


                <div className="admin-chart-body">

                  <div className="admin-chart-grid">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>


                  <svg
                    className="admin-line-chart"
                    viewBox="0 0 700 250"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="salesGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#c7a55a"
                          stopOpacity="0.30"
                        />

                        <stop
                          offset="100%"
                          stopColor="#c7a55a"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>


                    <path
                      className="admin-chart-area"
                      d="
                        M 10 190
                        L 120 155
                        L 230 95
                        L 340 135
                        L 450 80
                        L 560 115
                        L 690 40
                        L 690 230
                        L 10 230
                        Z
                      "
                    />


                    <polyline
                      className="admin-chart-line"
                      points="
                        10,190
                        120,155
                        230,95
                        340,135
                        450,80
                        560,115
                        690,40
                      "
                    />


                    {[
                      [10, 190],
                      [120, 155],
                      [230, 95],
                      [340, 135],
                      [450, 80],
                      [560, 115],
                      [690, 40],
                    ].map(([cx, cy]) => (
                      <circle
                        key={`${cx}-${cy}`}
                        cx={cx}
                        cy={cy}
                        r="5"
                        className="admin-chart-point"
                      />
                    ))}

                  </svg>


                  <div className="admin-chart-x-labels">
                    <span>18 Sep</span>
                    <span>19 Sep</span>
                    <span>20 Sep</span>
                    <span>21 Sep</span>
                    <span>22 Sep</span>
                    <span>23 Sep</span>
                    <span>24 Sep</span>
                  </div>

                </div>

              </div>

            </section>


            {/* ORDERS STATUS */}

            <section className="admin-dashboard-card admin-order-status-card">

              <div className="admin-card-header">
                <div>
                  <h2>Orders by Status</h2>
                  <p>Current distribution</p>
                </div>
              </div>


              <div className="admin-donut-wrapper">

                <div className="admin-order-donut">
                  <div>
                    <strong>124</strong>
                    <span>Total Orders</span>
                  </div>
                </div>


                <div className="admin-donut-legend">

                  {statusData.map((item) => (
                    <div
                      className="admin-legend-row"
                      key={item.name}
                    >
                      <span
                        className={`admin-legend-dot ${item.className}`}
                      />

                      <p>{item.name}</p>

                      <strong>{item.value}%</strong>
                    </div>
                  ))}

                </div>

              </div>

            </section>

          </div>


          {/* =================================================
              BOTTOM CARDS
          ================================================== */}

          <div className="admin-dashboard-bottom-grid">

            {/* TOP PRODUCTS */}

            <section className="admin-dashboard-card">

              <div className="admin-card-header">
                <div>
                  <h2>Top Selling Products</h2>
                  <p>Best performing fragrances</p>
                </div>

                <Link to="/admin/products">
                  View all →
                </Link>
              </div>


              <div className="admin-top-products">

                {topProducts.map((product, index) => (
                  <div
                    className="admin-top-product"
                    key={product.name}
                  >

                    <span className="admin-product-rank">
                      {index + 1}
                    </span>


                    <div className="admin-mini-product-image">
                      AB
                    </div>


                    <div className="admin-top-product-info">

                      <div>
                        <strong>{product.name}</strong>

                        <span>
                          {product.sold} sold
                        </span>
                      </div>


                      <div className="admin-product-progress">
                        <span
                          style={{
                            width: `${product.percent}%`,
                          }}
                        />
                      </div>

                    </div>


                    <b>{product.sold}</b>

                  </div>
                ))}

              </div>

            </section>


            {/* REVENUE CATEGORY */}

            <section className="admin-dashboard-card">

              <div className="admin-card-header">
                <div>
                  <h2>Revenue by Collection</h2>
                  <p>Revenue distribution</p>
                </div>
              </div>


              <div className="admin-category-revenue">

                <div className="admin-revenue-donut">
                  <div>
                    <strong>₹1.48L</strong>
                    <span>Revenue</span>
                  </div>
                </div>


                <div className="admin-category-list">

                  {categoryData.map((category, index) => (
                    <div key={category.name}>

                      <span
                        className={`admin-category-dot category-${index + 1}`}
                      />

                      <p>{category.name}</p>

                      <strong>
                        {category.value}%
                      </strong>

                    </div>
                  ))}

                </div>

              </div>

            </section>

          </div>

        </div>


        {/* =====================================================
            RIGHT COLUMN
        ====================================================== */}

        <aside className="admin-dashboard-right">

          {/* RECENT ORDERS */}

          <section className="admin-dashboard-card">

            <div className="admin-card-header">
              <div>
                <h2>Recent Orders</h2>
                <p>Latest purchases</p>
              </div>

              <Link to="/admin/orders">
                View all →
              </Link>
            </div>


            <div className="admin-recent-orders">

              {recentOrders.map((order) => (
                <div
                  className="admin-recent-order"
                  key={order.id}
                >

                  <div className="admin-order-product">
                    AB
                  </div>


                  <div className="admin-order-details">

                    <div className="admin-order-line">
                      <strong>{order.id}</strong>

                      <b>
                        ₹{order.amount.toLocaleString('en-IN')}
                      </b>
                    </div>


                    <p>{order.customer}</p>


                    <div className="admin-order-bottom">

                      <StatusBadge status={order.status} />

                      <small>{order.time}</small>

                    </div>

                  </div>

                </div>
              ))}

            </div>

          </section>


          {/* QUICK ACTIONS */}

          <section className="admin-dashboard-card admin-quick-card">

            <div className="admin-card-header">
              <div>
                <h2>Quick Actions</h2>
                <p>Frequently used actions</p>
              </div>
            </div>


            <div className="admin-quick-grid">

              <Link to="/admin/products/add">
                <span>＋</span>
                Add Product
              </Link>

              <Link to="/admin/inventory">
                <span>◇</span>
                Manage Inventory
              </Link>

              <Link to="/admin/orders">
                <span>□</span>
                View Orders
              </Link>

              <Link to="/admin/reports">
                <span>▤</span>
                Generate Report
              </Link>

            </div>

          </section>


          {/* BRAND CARD */}

          <section className="admin-dashboard-brand-card">

            <div>
              <span>AL BRR PERFUMES</span>

              <h3>
                The Essence
                <br />
                <em>of Goodness</em>
              </h3>

              <p>
                Luxury fragrances crafted for
                lasting impressions.
              </p>
            </div>

            <div className="admin-brand-decoration">
              AB
            </div>

          </section>

        </aside>

      </div>

    </div>
  )
}

export default Dashboard