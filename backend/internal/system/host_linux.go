//go:build linux

package system

import (
	"os"
	"strconv"
	"strings"
	"syscall"
)

func loadAvg() []float64 {
	b, err := os.ReadFile("/proc/loadavg")
	if err != nil {
		return []float64{0, 0, 0}
	}
	f := strings.Fields(string(b))
	out := make([]float64, 0, 3)
	for i := 0; i < 3 && i < len(f); i++ {
		v, _ := strconv.ParseFloat(f[i], 64)
		out = append(out, v)
	}
	return out
}

func meminfo(key string) int64 {
	b, err := os.ReadFile("/proc/meminfo")
	if err != nil {
		return 0
	}
	for _, line := range strings.Split(string(b), "\n") {
		if strings.HasPrefix(line, key+":") {
			f := strings.Fields(line)
			if len(f) >= 2 {
				v, _ := strconv.ParseInt(f[1], 10, 64)
				return v * 1024
			}
		}
	}
	return 0
}
func memTotal() int64 { return meminfo("MemTotal") }
func memFree() int64  { return meminfo("MemAvailable") }

func diskFree(dir string) *Disk {
	var st syscall.Statfs_t
	if err := syscall.Statfs(dir, &st); err != nil {
		return nil
	}
	return &Disk{Free: int64(st.Bavail) * int64(st.Bsize), Total: int64(st.Blocks) * int64(st.Bsize)}
}
