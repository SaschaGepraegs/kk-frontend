"""
Asteroids Annihilator
(C) 2025 Francesco Di Mauro - All rights reserved
Disclaimer: I do not own any sound present in this game.
            The sounds are downloaded from free websites and serve only as examples of functioning sounds
            implemented in the game.
Note: this game needs Python 3.12 and pygame (the most common library for implementing video games in Python).
"""

import math
import random
import time

import pygame
import pygame.freetype

SCREEN_WIDTH, SCREEN_HEIGHT = 1920, 1080
HALF_WIDTH = SCREEN_WIDTH // 2
HALF_HEIGHT = SCREEN_HEIGHT // 2
MIN_X = -HALF_WIDTH
MIN_Y = -HALF_HEIGHT
MAX_X = HALF_WIDTH - 1
MAX_Y = HALF_HEIGHT - 1
FPS = 60
SHIP_ACCELERATION = 0.1
DEFAULT_ACCELERATION = 2.5
BULLET_ACCELERATION = 3
FRICTION = 0.99
ANGLE_STEP = 5  # The increase or decrease in degrees when the user has pressed left or right to rotate the ship.
INITIAL_LIFE_POINTS = 200
BULLET_LIFE_SPAN = FPS * 10  # A bullet lasts 10 seconds on screen.
WAIT_TIME_FOR_NEXT_FIRE = int(FPS * 0.5)  # Waits half a second before the ship can fire again.
INITIAL_ASTEROIDS = 10
ENEMY_SPAWN_FREQUENCY = FPS * 10  # A new asteroid should appear on screen every 10 seconds (on average).
ALIEN_FIRE_FREQUENCY = FPS * 1  # An alien can fire every 1 seconds (on average).
# All damages count as points as well (e.g.: it's a damage if the ship was hit, or it's a point if the ship's bullet
# has hit any object.
DEFAULT_DAMAGE = 5
SMALL_DAMAGE = 10
MEDIUM_DAMAGE = 20
BIG_DAMAGE = 30
ALIEN_DAMAGE = 50
MEDIUM_SPLIT_ANGLE = ANGLE_STEP * 12  # The two smaller asteroids will turn 60° each when a medium asteroid has been hit.
BIG_SPLIT_ANGLE = ANGLE_STEP * 9  # The two medium asteroids will turn 45° each when a big asteroid has been hit.
GAME_OVER_TIME = 5


def get_ships():
    """Returns the list of ships (if any)"""
    ships = []  # The list of ships is empty, at the beginning.
    for character in characters:  # Iterates over all objects which are currently visible in the screen.
        if isinstance(character, Ship):  # Checks if an object is a ship (derives from the Ship class).
            ships.append(character)  # If yes, we save it into the above list of ships.
    return ships  # When it's done, it gives back the list of ships which were found.


class Character:  # The base class for all characters.
    # x and y represent the centre of the character because it makes it easy to calculate the movements.
    def __init__(self, x, y, angle, image, hit_sound=None):
        self.x = x
        self.y = y
        self.angle = angle
        self.image = image
        self.hit_sound = hit_sound
        self.acceleration = DEFAULT_ACCELERATION
        self.velocity_x = 0
        self.velocity_y = 0
        self.apply_friction = False
        self.rotated = False
        self.life_points = 1  # By default, characters are being destroyed when they are hit.
        self.high_score = 0
        self.damage = DEFAULT_DAMAGE

    def draw(self):  # Draws the character to the screen.
        # https://stackoverflow.com/questions/58603835/how-to-rotate-an-imageplayer-to-the-mouse-direction
        # The below code was inspired by the website listed above. 
        # It generates a new image of the character, rotated by its angle.
        if self.rotated:
            image = pygame.transform.rotate(self.image, self.angle)
        else:
            image = self.image
        
        # When the image has to be printed we should take into account that x and y represent their centre, and that
        # y starts from top as zero and goes "down" (increasing values) until the bottom of the screen on a computer
        # (so, it has to be "corrected" by mirroring the value)
        screen.blit(image, (HALF_WIDTH + self.x - image.get_width() / 2,
                                HALF_HEIGHT - self.y - image.get_height() / 2))

    def rotate(self, step):
        self.angle += step
        if self.angle < 0:
            self.angle += 360  # Keep the angle positive or zero.
        self.angle %= 360  # Keep the angle between 0 and 359.

    def accelerate(self):
        """Calculates the direction based on the angle"""
        rad = math.radians(self.angle)
        self.velocity_x += self.acceleration * math.cos(rad)
        self.velocity_y += self.acceleration * math.sin(rad)

    def update_and_inside_screen(self):
        # Apply inertia.
        self.x += self.velocity_x
        self.y += self.velocity_y

        if self.apply_friction:
            self.velocity_x *= FRICTION
            self.velocity_y *= FRICTION

        # Manage screen borders.
        half_width = self.image.get_width() / 2
        if self.x < -half_width + MIN_X:
            self.x += SCREEN_WIDTH
        if self.x >= MAX_X + half_width:
            self.x -= SCREEN_WIDTH
        half_height = self.image.get_height() / 2
        if self.y < -half_height + MIN_Y:
            self.y += SCREEN_HEIGHT
        if self.y >= MAX_Y + half_height:
            self.y -= SCREEN_HEIGHT

        return True  # By default, characters are always visible. Only Bullet can disappear.

    def collided(self, other):
        if type(self) == type(other):  # By default, characters of the same type don't collide.
            return False

        # Takes the average of the width and height to calculate the radius of the character.
        my_radius = (self.image.get_width() + self.image.get_height()) / 4
        # Same for the other object.
        other_radius = (other.image.get_width() + other.image.get_height()) / 4

        delta_x = self.x - other.x
        delta_y = self.y - other.y
        distance = math.sqrt(delta_x * delta_x + delta_y * delta_y)

        # The characters collided if the distance from their centers is less than the sum of their radiuses.
        return distance <= my_radius + other_radius

    def hit(self, damage):
        """Implements what should be done when the character is hit.
        Life points are updated according to the given damage factor.
        It also plays the hit sound, if it was set."""
        self.life_points -= damage  # Decreases the life.
        if self.life_points <= 0:  # Checks if it has no life anymore.
            self.life_points = 0  # Fixes the life if the hit was too big.

        if self.hit_sound:
            self.hit_sound.play()

        return []  # By default, no new characters are generated.


class Bullet(Character):
    def __init__(self, x, y, angle, ship):
        super().__init__(x, y, angle, ship.fire_image)
        self.ship = ship
        self.acceleration = BULLET_ACCELERATION
        self.life_points = BULLET_LIFE_SPAN
        self.accelerate()

    def update_and_inside_screen(self):
        super().update_and_inside_screen()
        self.life_points -= 1

        return self.life_points > 0

    def hit(self, damage):
        super().hit(damage)
        self.ship.high_score += damage
        self.life_points = 0

        return []


class Enemy(Character):
    @staticmethod
    def generate_position(x, y, angle):
        if x is None or y is None:
            if 45 <= angle < 135:  # Towards top screen
                x = random.randrange(MIN_X, MAX_X + 1)
                y = MIN_Y
            elif 135 <= angle < 225:  # Towards left screen
                x = MAX_X
                y = random.randrange(MIN_X, MAX_Y + 1)
            elif 225 <= angle < 315:  # Towards bottom screen
                x = random.randrange(MIN_X, MAX_X + 1)
                y = MAX_Y
            else:  # Towards right screen
                x = MIN_X
                y = random.randrange(MIN_X, MAX_Y + 1)

        return x, y

    @staticmethod
    def generate_enemy_class():
        enemy_probability = random.randrange(100)
        if enemy_probability < 60:  # The small asteroid has 60% (0..59) probability of appearing.
            enemy_class = SmallAsteroid
        elif enemy_probability < 80:  # The medium asteroid has 20% (60..79) probability of appearing.
            enemy_class = MediumAsteroid
        elif enemy_probability < 90:  # The big asteroid has 10% (80..89) probability of appearing.
            enemy_class = BigAsteroid
        else:  # The alien ship has 10% (90..99) probability of appearing.
            enemy_class = Alien

        return enemy_class


class Asteroid(Enemy):
    def collided(self, other):
        if isinstance(other, Asteroid):  # Asteroids don't collide with each others.
            return False

        return super().collided(other)

    def hit(self, damage):
        super().hit(damage)
        split_class = self.split_class
        if split_class is None:
            return []
        else:
            split_asteroid_1 = split_class(self.angle - self.split_angle, self.x, self.y)
            split_asteroid_2 = split_class(self.angle + self.split_angle, self.x, self.y)

            return [split_asteroid_1, split_asteroid_2]


class SmallAsteroid(Asteroid):
    def __init__(self, angle, x=None, y=None):
        x, y = self.generate_position(x, y, angle)
        super().__init__(x, y, angle, small_asteroid_image, bang_small_sound)
        self.damage = SMALL_DAMANGE
        self.split_class = None
        self.split_angle = 0
        self.accelerate()


class MediumAsteroid(Asteroid):
    def __init__(self, angle, x=None, y=None):
        x, y = self.generate_position(x, y, angle)
        super().__init__(x, y, angle, medium_asteroid_image, bang_medium_sound)
        self.damage = MEDIUM_DAMANGE
        self.split_class = SmallAsteroid
        self.split_angle = MEDIUM_SPLIT_ANGLE
        self.accelerate()


class BigAsteroid(Asteroid):
    def __init__(self, angle, x=None, y=None):
        x, y = self.generate_position(x, y, angle)
        super().__init__(x, y, angle, big_asteroid_image, bang_large_sound)
        self.damage = BIG_DAMANGE
        self.split_class = MediumAsteroid
        self.split_angle = BIG_SPLIT_ANGLE
        self.accelerate()


class Alien(Enemy):
    def __init__(self, angle, x=None, y=None):
        x, y = self.generate_position(x, y, angle)
        super().__init__(x, y, angle, alien_ship_image, bang_alien_sound)
        self.fire_image = alien_fire_image
        self.damage = ALIEN_DAMANGE
        self.accelerate()
        alien_sound.play()

    def update_and_inside_screen(self):
        super().update_and_inside_screen()

        # If there's at least a ship, generates a random number and checks if we can fire a bullet.
        ships = get_ships()
        if len(ships) != 0 and random.randrange(ALIEN_FIRE_FREQUENCY) == 0:
            ship = random.choice(ships)

            # https://stackoverflow.com/questions/42258637/how-to-know-the-angle-between-two-vectors
            # The below code was inspired by the website listed above.
            # Calculates the angle between the alien and the spaceship.
            angle = math.degrees(math.atan2(ship.y - self.y, ship.x - self.x))

            alien_radius = max(self.image.get_width(), self.image.get_height()) / 2
            fire_radius = max(self.fire_image.get_width(), self.fire_image.get_height()) / 2
            radius = alien_radius + fire_radius
            x1 = radius * math.cos(angle * math.pi / 180)
            y1 = radius * math.sin(angle * math.pi / 180)

            # Positions the bullet to the border of the alien cannon end, at the calculated angle.
            bullet = Bullet(self.x + x1, self.y + y1, angle, self)
            characters.append(bullet)
            alien_fire_sound.play()

        return True  # Alien ships wrap around the screen, so they are always visible.


class Ship(Character):
    def __init__(self, x, y, angle, image, fire_image, colour, bar_left, bar_top):
        super().__init__(x, y, angle, image, bang_ship_sound)
        self.fire_image = fire_image
        self.apply_friction = True
        self.acceleration = SHIP_ACCELERATION
        self.life_points = INITIAL_LIFE_POINTS
        self.rotation_step = 0
        self.accelerates = False
        self.colour = colour
        self.bar_left = bar_left
        self.bar_top = bar_top
        self.rotated = True
        self.wait_for_next_fire = 0

    def draw(self):  # Draws the character to the screen.
        super().draw()

        # https://stackoverflow.com/questions/19780411/pygame-drawing-a-rectangle
        # The below code was inspired by the website listed above.
        # Draws the life bar proportionally to the current value.
        pygame.draw.rect(screen, self.colour, (self.bar_left, self.bar_top, self.life_points, 20))

        # Converts the high score to a string and draws it.
        # https://stackoverflow.com/questions/20620109/how-to-render-transparent-text-with-alpha-channel-in-pygame#20622680
        # The below code was inspired by the website listed above.
        # It allows to draw a text, using a specified colour, to the screen surface at the given position.
        font.render_to(screen, (self.bar_left + 210, self.bar_top), str(self.high_score), self.colour)

    def turns_left(self):
        self.rotation_step = ANGLE_STEP  # The ship moves anti-clockwise.

    def turns_right(self):
        self.rotation_step = -ANGLE_STEP  # The ship moves clockwise.

    def stops_rotation(self):
        self.rotation_step = 0

    def fires(self):
        if self.wait_for_next_fire == 0:  # Fires only if it hasn't fired recently
            self.wait_for_next_fire = WAIT_TIME_FOR_NEXT_FIRE
            # https://stackoverflow.com/questions/9007977/draw-circle-using-pixels-applied-in-an-image-with-for-loop
            # The below code was inspired by the website listed above.
            # Calculates the coordinates of the point of the circle given its centre, radius, and angle.
            # Those coordinates represent the position of the ship cannon end.
            ship_radius = max(self.image.get_width(), self.image.get_height()) / 2
            fire_radius = max(self.fire_image.get_width(), self.fire_image.get_height()) / 2
            radius = ship_radius + fire_radius
            x1 = radius * math.cos(self.angle * math.pi / 180)
            y1 = radius * math.sin(self.angle * math.pi / 180)

            # Positions the bullet to the border of the ship cannon end, at the same angle.
            bullet = Bullet(self.x + x1, self.y + y1, self.angle, self)
            characters.append(bullet)
            fire_sound.play()

    def starts_acceleration(self):
        self.accelerates = True

    def stops_acceleration(self):
        self.accelerates = False

    def update_and_inside_screen(self):
        self.wait_for_next_fire = max(self.wait_for_next_fire - 1, 0)  # Scales the wait time down of one unit.
        self.rotate(self.rotation_step)  # Updates the movement (only if the left or right key is pressed).
        if self.accelerates:  # Accelerates (if the up key is still pressed).
            self.accelerate()
        super().update_and_inside_screen()

        return True  # Ships wrap around the screen, so they are always visible.


class Game:  # The class that handles the game main loop.
    def __init__(self):
        self.running = False

    @staticmethod
    def init_characters():
        for i in range(INITIAL_ASTEROIDS):
            asteroid_class = Asteroid.generate_enemy_class()
            # The asteroid starts at a random angle (using the proper step).
            random_angle = random.randrange(0, 360, ANGLE_STEP)
            characters.append(asteroid_class(random_angle))

        # The ship starts at a random angle (using the proper step).
        random_angle = random.randrange(0, 360, ANGLE_STEP)
        ship_assets = random.choice(ships_assets)
        colour, bar_x, bar_y, image, fire_image = ship_assets
        ship = Ship(0, 0, random_angle, image, fire_image, colour, bar_x, bar_y)  # Creates the ship object.
        characters.append(ship)

    def process_input_events(self):
        ship = get_ships()[0]
        for event in pygame.event.get():
            if event.type == pygame.KEYDOWN:  # Checks what to do when some keys are pressed.
                if event.key == pygame.K_ESCAPE:
                    self.running = False
                elif event.key == pygame.K_LEFT:
                    ship.turns_left()
                elif event.key == pygame.K_RIGHT:
                    ship.turns_right()
                elif event.key == pygame.K_SPACE:
                    ship.fires()
                elif event.key == pygame.K_UP:
                    ship.starts_acceleration()
            elif event.type == pygame.KEYUP:  # Checks what to do when some keys are released.
                if event.key == pygame.K_LEFT or event.key == pygame.K_RIGHT:
                    ship.stops_rotation()
                elif event.key == pygame.K_UP:
                    ship.stops_acceleration()


    @staticmethod
    def generate_new_characters():
        # Generates a random number and checks if we can spawn an enemy.
        if random.randrange(ENEMY_SPAWN_FREQUENCY) == 0:
            enemy_class = Enemy.generate_enemy_class()
            # The enemy starts at a random angle (using the proper step).
            random_angle = random.randrange(0, 360, ANGLE_STEP)
            new_character = enemy_class(random_angle)
            characters.append(new_character)

    @staticmethod
    def update_characters():
        updated_list = []
        for character in characters:
            if character.update_and_inside_screen():
                updated_list.append(character)
        characters.clear()
        for character in updated_list:
            characters.append(character)

    @staticmethod
    def check_and_handle_collisions():
        i = 0
        while i < len(characters) - 1:
            first = characters[i]
            j = i + 1
            while j < len(characters):
                second = characters[j]
                if first.collided(second):
                    for new_character in first.hit(second.damage):
                        characters.append(new_character)
                    for new_character in second.hit(first.damage):
                        characters.append(new_character)
                    if second.life_points <= 0:
                        del characters[j]
                        break
                j += 1
            if first.life_points <= 0:
                del characters[i]
            else:
                i += 1

    @staticmethod
    def draw_graphic():
        screen.blit(background_image, (0, 0))  # Fills the entire screen with the background image.

        for character in characters:
            character.draw()

        pygame.display.flip()  # Displays the generated graphic.
        fps_clock.tick(FPS)  # Ensures that the game is synchronized to the defined frequency.

    def run(self):
        # https://nerdparadise.com/programming/pygame/part3
        # The below code was inspired by the website listed above.
        music_sound = pygame.mixer.Sound("Music.mp3")  # Loads the game's music.
        music_sound.play(-1)  # Plays the music, repeating it forever.

        self.init_characters()
        self.running = True
        while self.running:
            self.process_input_events()
            self.generate_new_characters()
            self.update_characters()
            self.check_and_handle_collisions()
            self.draw_graphic()
            if len(get_ships()) == 0:  # Checks if there aren't ships anymore.
                self.running = False
                game_over_sound = pygame.mixer.Sound("Game Over.wav")
                game_over_sound.play()
                music_sound.stop()
                game_over = pygame.image.load("Game Over.png")
                screen.blit(game_over, (0, 0))  # Shows the game over picture.
                pygame.display.flip()  # Displays the generated graphic.
                time.sleep(GAME_OVER_TIME)  # Waits some time before closing the application.


pygame.init()  # Initialized pygame.
fps_clock = pygame.time.Clock()  # Gets the pygame clock to synchronize the game to a certain frame rate.
screen = pygame.display.set_mode(size=(SCREEN_WIDTH, SCREEN_HEIGHT), flags=pygame.FULLSCREEN)  # Sets a full-hd screen.
# https://stackoverflow.com/questions/20620109/how-to-render-transparent-text-with-alpha-channel-in-pygame#20622680
# The below code was inspired by the website listed above.
font = pygame.freetype.SysFont('arial', 24)  # Selects the Arial font.

ships_assets = [
    [(0, 0, 255), 10, 10, pygame.image.load("GFX/Spaceship Blue.png"), pygame.image.load("GFX/Fire Blue.png")],
    [(0, 255, 255), 490, 10, pygame.image.load("GFX/Spaceship Cyan.png"), pygame.image.load("GFX/Fire Cyan.png")],
    [(0, 255, 0), 970, 10, pygame.image.load("GFX/Spaceship Green.png"), pygame.image.load("GFX/Fire Green.png")],
    [(100, 255, 77), 1450, 10, pygame.image.load("GFX/Spaceship Lime.png"), pygame.image.load("GFX/Fire Lime.png")],
    [(255, 100, 0), 10, 1050, pygame.image.load("GFX/Spaceship Orange.png"), pygame.image.load("GFX/Fire Orange.png")],
    [(255, 77, 255), 490, 1050, pygame.image.load("GFX/Spaceship Pink.png"), pygame.image.load("GFX/Fire Pink.png")],
    [(255, 0, 0), 970, 1050, pygame.image.load("GFX/Spaceship Red.png"), pygame.image.load("GFX/Fire Red.png")],
    [(255, 255, 0), 1450, 1050, pygame.image.load("GFX/Spaceship Yellow.png"), pygame.image.load("GFX/Fire Yellow.png")],
]
background_image = pygame.image.load("Background.png")
alien_ship_image = pygame.image.load("GFX/AlienShip.png")
small_asteroid_image = pygame.image.load("GFX/SmallAsteroid.png")
medium_asteroid_image = pygame.image.load("GFX/MediumAsteroid.png")
big_asteroid_image = pygame.image.load("GFX/BigAsteroid.png")
alien_fire_image = pygame.image.load("GFX/AlienFire.png")
alien_sound = pygame.mixer.Sound("SFX/Alien.wav")
alien_fire_sound = pygame.mixer.Sound("SFX/AlienFire.wav")
bang_alien_sound = pygame.mixer.Sound("SFX/BangAlien.wav")
bang_ship_sound = pygame.mixer.Sound("SFX/Bang.wav")
bang_small_sound = pygame.mixer.Sound("SFX/BangSmall.wav")
bang_medium_sound = pygame.mixer.Sound("SFX/BangMedium.wav")
bang_large_sound = pygame.mixer.Sound("SFX/BangLarge.wav")
fire_sound = pygame.mixer.Sound("SFX/Fire.wav")

characters = []
game = Game()  # Creates the game object.
game.run()  # Executes the game main loop.
