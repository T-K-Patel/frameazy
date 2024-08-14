const { Category, Collection, Color, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    for (let i = 1; i < 101; i++) {
        await prisma.frame.upsert({
            where: { name: "Frame" + i.toString() },
            update: {},
            create: {
                name: "Frame" + i.toString(),
                price: Math.floor(Math.random() * 1000),
                min_image: "helloimage",
                image: "https://s3-alpha-sig.figma.com/img/ab02/0fa4/f61635b8dbfc67d9759c2504146ee176?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oPd~ARj861vi8rZA8jecd0HT5v6pUgNQp1kvn3HPgxKAnkLKMdvb9LDkQzUNhAkES3onhMej88GXbjSSCqNwcqvE6x4y9tsGg3eTX7ItTXMo~2gfOCS7wlSd2Tl2p04RdxjcgZbbydKhowLn-iBKWVDLifm1Gldi2Er3AsVRw1yfhQOnX~4xvi07n~6zcu4lllifFES6BDlI5CRs4Fds638Jq-4wwoGOFKo1wC1Q-w6KzGzC3UZ4cR7Pzzwws1ydd0OFzCna9xueaiyoqd~Rvo9TuLtNs3gJB1ZuY1JDjLVsQHJLM342D~RwZriU-NBVl56OwgvzwLGraHHLLvGAHw__",
                category: Object.values(Category)[Math.floor(Math.random() * Object.values(Category).length)],
                collection: Object.values(Collection)[Math.floor(Math.random() * Object.values(Collection).length)],
                color: Object.values(Color)[Math.floor(Math.random() * Object.values(Color).length)],
                height: Math.floor(Math.random() * 100),
                width: Math.floor(Math.random() * 100),
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
