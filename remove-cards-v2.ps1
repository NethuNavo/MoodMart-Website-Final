# Read file
$filePath = "src\app\pages\DashboardPage.tsx"
$content = [System.IO.File]::ReadAllText($filePath)

# Find and replace the second lg:grid-cols-3 section (contains Habit Tracker, Journal Preview, Audio Recommendation)
# Keep only Audio Recommendation

$oldSection = @"
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.08)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Habit Tracker</p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-950">Healthy habits</h3>
                </div>
                <Activity className="h-6 w-6 text-slate-600" />
              </div>
              <div className="mt-8 space-y-5">
                {habitTracker.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                      <span>{item.label}</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="mt-3 h-2.5 rounded-full bg-slate-200 overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${item.color}`} style={{ width: `${item.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.08)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Journal Preview</p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-950">Today&apos;s reflection</h3>
                </div>
                <BookOpen className="h-6 w-6 text-slate-600" />
              </div>
              <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-600">"Today was more productive than I expected. The breathing session in the morning really helped me stay calm."</p>
                <p className="mt-4 text-xs text-slate-500">4:35 PM</p>
              </div>
              <Button onClick={() => navigate('/mood')} className="mt-6 w-full rounded-full bg-violet-600 text-white hover:bg-violet-700">Continue Writing</Button>
            </Card>
"@

$newSection = @"
          <div className="grid gap-6 lg:grid-cols-3">
"@

$content = $content.Replace($oldSection, $newSection)

# Now remove Sleep Wellness card from the xl:grid-cols-3 section
$sleepCard = @"
            <Card className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.08)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Sleep Wellness</p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-950">Rest quality</h3>
                </div>
                <Moon className="h-6 w-6 text-slate-600" />
              </div>
              <div className="mt-8 space-y-5">
                <div className="rounded-[28px] bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                    <span>Sleep duration</span>
                    <span>7h 20m</span>
                  </div>
                  <div className="mt-3 h-2.5 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500" />
                  </div>
                </div>
                <div className="rounded-[28px] bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Good Sleep Quality</p>
                </div>
                <div className="rounded-[28px] border border-slate-200 bg-white p-4">
                  <div className="h-28">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sleepTrendData}>
                        <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#68738D' }} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ fill: 'rgba(148,163,184,0.1)' }} />
                        <Bar dataKey="value" radius={[12,12,0,0]} fill="#8B5CF6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </Card>

"@

$content = $content.Replace($sleepCard, "")

# Write back
[System.IO.File]::WriteAllText($filePath, $content)
Write-Host "Successfully removed three dashboard cards!"
