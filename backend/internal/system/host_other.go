//go:build !linux

package system

func loadAvg() []float64  { return []float64{0, 0, 0} }
func memTotal() int64     { return 0 }
func memFree() int64      { return 0 }
func diskFree(string) *Disk { return nil }
