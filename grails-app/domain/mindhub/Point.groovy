package mindhub

class Point {
	int x
	int y
    static constraints = {
    }
	void add(Point pt) {
		x += pt.x
		y += pt.y
	}
}
