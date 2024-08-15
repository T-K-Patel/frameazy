const { Category, Collection, Color, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    for (let i = 1; i < 101; i++) {
        await prisma.frame.upsert({
            where: { name: "Frame" + i.toString() },
            update: {},
            create: {
                name: "Frame" + i.toString(),
                unit_price: Math.floor(Math.random() * 1000),
                image: "https://s3-alpha-sig.figma.com/img/ab02/0fa4/f61635b8dbfc67d9759c2504146ee176?Expires=1724630400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=dS8ESuC~z3q47J-M7ukCNoghEchTU01lPoohOx0r7~vk3e2RYOGHTUFTN~FZrHJ3IpNMIEBPqf9DCKmiDm7Vq~-~LCL7qDcxhQ7-wHig0sWpNWo2SPp7sE~h9ydHF-~DEnMMj25sEf3x0Hlgx~kUrs-RK-fYfvZ0NVzq~CYGMlOWGZ4HhwPKXlpL9GowE0anzBPZfoCzH2BgC~eFkGqFGZ1C24Zr9I5PQslxECq-8P~V35oZUYy8YcPCJ7i6ICvuJU51U4HyVrx3TqjFml~3OgKhboZCDfTJsqIjZESf9fqb4QrzKYWtANJsM80qYAFBupE4XKTgxr1XY0I-zORY5Q__",
                category: Object.values(Category)[Math.floor(Math.random() * Object.values(Category).length)],
                collection: Object.values(Collection)[Math.floor(Math.random() * Object.values(Collection).length)],
                color: Object.values(Color)[Math.floor(Math.random() * Object.values(Color).length)],
                borderWidth: Math.floor(Math.random() * 10),
                borderSrc:
                    "https://s3-alpha-sig.figma.com/img/ab02/0fa4/f61635b8dbfc67d9759c2504146ee176?Expires=1724630400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=dS8ESuC~z3q47J-M7ukCNoghEchTU01lPoohOx0r7~vk3e2RYOGHTUFTN~FZrHJ3IpNMIEBPqf9DCKmiDm7Vq~-~LCL7qDcxhQ7-wHig0sWpNWo2SPp7sE~h9ydHF-~DEnMMj25sEf3x0Hlgx~kUrs-RK-fYfvZ0NVzq~CYGMlOWGZ4HhwPKXlpL9GowE0anzBPZfoCzH2BgC~eFkGqFGZ1C24Zr9I5PQslxECq-8P~V35oZUYy8YcPCJ7i6ICvuJU51U4HyVrx3TqjFml~3OgKhboZCDfTJsqIjZESf9fqb4QrzKYWtANJsM80qYAFBupE4XKTgxr1XY0I-zORY5Q__",
            },
        });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
