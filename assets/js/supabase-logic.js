function safeText(str) {
  if (!str) return "";
  const p = document.createElement("p");
  p.textContent = str;

  return p.innerHTML.replace(/\n/g, "<br>");
}

const supabaseUrl = "https://vnzcwijqlkdsjokvmpgv.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuemN3aWpxbGtkc2pva3ZtcGd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNTE0MzEsImV4cCI6MjA4NzgyNzQzMX0.LS7XzMXOknHl6zhobn5oyMiG5bHqu2zucSKF0n_NGEE";
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);
